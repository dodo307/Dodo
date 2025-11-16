function TagList(props) {
  return (
    <div className="tagList">
      {/* List each tag in the tags list */}
      {props.tags.map(tag => (
        <div className="tag" key={tag}>
          #{tag}
        </div>
      ))}
      {/* Add tag button. Only shows if hovering the tag list or if no tags exist */}
      <div className="tag addTag" style={{ display: props.tags.length ? '' : 'inline-block' }}>
        +
      </div>
    </div>
  );
}

export default TagList;
