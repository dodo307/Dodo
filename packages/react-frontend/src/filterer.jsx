import TagList from './tagList';

function Filterer(props) {
  // Update filter object upon any change
  function updateFilter(event) {
    const { name, value } = event.target;
    props.setFilter({ ...props.filter, [name]: value });
  }

  // Update the tags of the filter with a new list of tags
  function updateTags(tags) {
    props.setFilter({ ...props.filter, tags: tags });
  }

  return (
    <div id="filtererWrapper">
      <div id="filterer">
        <h5 style={{ margin: 0 }}>Filter</h5>
        {/* Filter by task checked state */}
        <div>
          Checked:&nbsp;
          <select name="checked" value={props.filter.checked} onChange={updateFilter}>
            <option value="-">-</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        {/* Filter by tags each task has */}
        <div>
          Tags:&nbsp;
          <div className="tagListWrapper">
            <TagList
              tags={props.filter.tags}
              filter={props.filter}
              setFilter={props.setFilter}
              updateTags={updateTags}
              mode="filter"
              style={{ display: 'inline-flex', flexWrap: 'wrap', marginRight: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filterer;
