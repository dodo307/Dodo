function Filterer(props) {
  function updateFilter(event) {
    const { name, value } = event.target;
    props.setFilter({ ...props.filter, [name]: value });
  }

  return (
    <div id="filtererWrapper">
      <div id="filterer">
        <h5>Filter</h5>
        Checked:{' '}
        <select name="checked" value={props.filter.checked} onChange={updateFilter}>
          <option value="none">None</option>
          <option value="checked">Checked</option>
          <option value="unchecked">Unchecked</option>
        </select>
      </div>
    </div>
  );
}

export default Filterer;
