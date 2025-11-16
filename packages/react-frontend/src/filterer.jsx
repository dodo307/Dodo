function Filterer(props) {
  // Update filter object upon any change
  function updateFilter(event) {
    const { name, value } = event.target;
    props.setFilter({ ...props.filter, [name]: value });
  }

  return (
    <div id="filtererWrapper">
      <div id="filterer">
        <h5 style={{ margin: 0 }}>Filter</h5>
        {/* Filter by task checked state */}
        Checked:{' '}
        <select name="checked" value={props.filter.checked} onChange={updateFilter}>
          <option value="-">-</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );
}

export default Filterer;
