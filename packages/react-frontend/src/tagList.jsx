import { useEffect, useState, useRef } from 'react';

function TagList(props) {
  function addTag(tag) {
    if (props.tags.indexOf(tag) >= 0) return;
    const newTags = [...props.tags];
    newTags.push(tag);
    props.updateTags(newTags);
  }

  return (
    <div className="tagList">
      {/* List each tag in the tags list */}
      {props.tags.map(tag => (
        <div className="tag" key={tag}>
          #{tag}
        </div>
      ))}
      {/* Add tag button */}
      <AddTag tags={props.tags} addTag={addTag} />
    </div>
  );
}

function AddTag(props) {
  const [adding, setAdding] = useState(false);
  const newTag = useRef();

  function setCursor() {
    const range = document.createRange();
    const sel = window.getSelection();

    range.setStart(newTag.current, 0);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);
  }

  function handleKey(event) {
    // Submit Tag
    if (event.key == 'Enter') {
      event.preventDefault(); // Cancel new line behaviour
      props.addTag(event.currentTarget.innerText);
      setAdding(false);
    }
    // Cancel Tag
    if (event.key == 'Escape') setAdding(false);
  }

  useEffect(() => {
    // Set cursor to contenteditable span as soon as it's rendered
    if (adding) setCursor();
  }, [adding]);

  if (adding) {
    // If typing a tag, type in contenteditable span
    return (
      <div className="tag">
        #
        <span
          ref={newTag}
          onKeyDown={handleKey}
          onBlur={() => setAdding(false)}
          style={{ outline: 'none', WebkitUserModify: 'read-write-plaintext-only' }}
          contentEditable
        ></span>
      </div>
    );
  }
  // Not currently typing a tag so button mode. Button shows if no tags are listed or if tag list is hovered (style.css)
  return (
    <div
      className="tag addTag"
      onClick={() => setAdding(true)}
      style={{ display: props.tags.length ? '' : 'inline-block' }}
    >
      +
    </div>
  );
}

export default TagList;
