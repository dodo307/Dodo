import { useEffect, useState, useRef } from 'react';

function TagList(props) {
  // Current selected tag (for editing)
  const [selectedTag, setSelectedTag] = useState(undefined);

  // Given a tag to add, add it if it is new and not undefined
  function addTag(tag) {
    if (tag === undefined) return;
    tag = tag.trim();
    if (!tag.length || props.tags.indexOf(tag) >= 0) return;
    const newTags = [...props.tags];
    newTags.push(tag);
    props.updateTags(newTags);
  }

  // Given the index of the tag to edit and the replacement tag, make the edit if it is new and not undefined
  function editTag(i, tag) {
    setSelectedTag(undefined);
    if (tag === undefined) return;
    tag = tag.trim();
    if (props.tags.indexOf(tag) >= 0) return;
    let newTags = [...props.tags];
    if (tag.length) {
      newTags[i] = tag;
    } else {
      newTags.splice(i, 1);
    }
    props.updateTags(newTags);
  }

  // Given the name of a tag, add/remove it from the filter
  function toggleTagFilter(tag) {
    const filter = props.filter;
    const newTags = [...filter.tags];
    const index = newTags.indexOf(tag);
    if (index >= 0) {
      // If currently in filter, remove it
      newTags.splice(index, 1);
    } else {
      // Otherwise, add it to filter
      newTags.push(tag);
    }
    props.setFilter({ ...filter, tags: newTags });
  }

  // Upon tag selection (click)
  function selectTag(i) {
    if (props.mode == 'filter') {
      toggleTagFilter(props.tags[i]);
    }
    setSelectedTag(i);
  }

  return (
    <div className="tagList" style={props.style}>
      {/* List each tag in the tags list */}
      {props.tags.map((tag, i) => {
        if (selectedTag == i) {
          switch (props.mode) {
            case 'edit':
              // Editable tag that can be typed into
              return (
                <EditableTag
                  submit={editTag.bind(undefined, i)}
                  value={tag}
                  key={tag}
                  blurBehavior={props.blurBehavior}
                ></EditableTag>
              );
          }
        }
        // Highlight tag if it is used in the filter
        if (props.mode == 'filter' && props.filter.tags.includes(tag)) {
          return (
            <div className="tag selectedTag" key={tag} onClick={() => selectTag(i)}>
              #{tag}
            </div>
          );
        }
        // If nothing else, just display the tag as normal
        return (
          <div className="tag" key={tag} onClick={() => selectTag(i)}>
            #{tag}
          </div>
        );
      })}
      {/* Add tag button */}
      <AddTag tags={props.tags} addTag={addTag} blurBehavior={props.blurBehavior} />
    </div>
  );
}

function AddTag(props) {
  // Bool if currently creating a new tag
  const [creating, setCreating] = useState(false);

  // Regardless of the submitted tag, attempt to add it and switch off creating
  function tagSubmitted(tag) {
    props.addTag(tag);
    setCreating(false);
  }

  if (creating) {
    // If typing a tag, type in contenteditable span
    return <EditableTag submit={tagSubmitted} blurBehavior={props.blurBehavior} />;
  }
  // Not currently typing a tag so button mode. Button shows if no tags are listed or if tag list is hovered (style.css)
  return (
    <div
      className="tag addTag"
      onClick={() => setCreating(true)}
      style={{ display: props.tags.length ? '' : 'inline-block' }}
    >
      +
    </div>
  );
}

// Functions like a tag except you can type into it. On mount, sets the cursor to highlight its contents
function EditableTag(props) {
  const newTag = useRef(); // Reference the span containing the tag (without the #)

  // Function that makes the cursor select the tag's text
  function setCursor() {
    const range = document.createRange();
    const sel = window.getSelection();

    range.selectNodeContents(newTag.current);

    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Handles key events like submitting via Enter and exiting via Escape
  function handleKey(event) {
    // Submit Tag
    if (event.key == 'Enter') {
      event.preventDefault(); // Cancel new line behaviour
      props.submit(event.currentTarget.innerText);
    }
    // Cancel Tag
    if (event.key == 'Escape') props.submit(undefined);
  }

  // On tag blur (unfocus)
  function handleBlur(event) {
    switch (props.blurBehavior) {
      case 'submit': // If blurBehavior == "submit", submit tag upon blur
        props.submit(event.currentTarget.innerText);
        break;
      default: // Otherwise cancel operation upon blur
        props.submit(undefined);
    }
  }

  // After mounting, set default value to props.value if it exists, otherwise use empty string. Then move cursor
  useEffect(() => {
    newTag.current.innerText = props.value || '';
    setCursor();
  }, [props.value]);

  return (
    <div className="tag editableTag">
      #
      <span
        ref={newTag}
        onKeyDown={handleKey}
        onBlur={handleBlur}
        style={{ outline: 'none', WebkitUserModify: 'read-write-plaintext-only' }} // Hide outline and only plaintext
        contentEditable
      ></span>
    </div>
  );
}

export default TagList;
