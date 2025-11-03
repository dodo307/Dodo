function DatedList(props) {

  return <div id="datedList">
    <h4>Today</h4>
    <p>some date lmao</p>
    <Tasks list={props.list} />
  </div>;
}

function Tasks(props) {
  console.log(props.list);
  const rows = props.list.map(x => <div>
    <h4>{x.name}</h4>
    <p>{x.time}</p>
    <input
      type="checkbox"
    ></input>
    <span class="hamburger">&#2807;</span>
  </div>)

  return rows;
}

export default DatedList;
