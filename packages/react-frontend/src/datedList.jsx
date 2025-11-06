import TripleDots from './assets/three-dots-vertical.svg';

function DatedList(props) {
  return (
    <div id="datedListWrapper">
      <div id="datedList">
        <h4>Today</h4>
        <p>some date lmao</p>
        <Tasks list={props.list} setPage={props.setPage} />
      </div>
    </div>
  );
}

function Tasks(props) {
  const rows = props.list.map(x => (
    <div key={x.id}>
      <h4>{x.name}</h4>
      <p>{x.time}</p>
      <input type="checkbox"></input>
      <img className="tripleDots" src={TripleDots}></img>
    </div>
  ));

  return (
    <div className="taskListWrapper">
      <div
        className="addTask unselectableText"
        onClick={props.setPage.bind(undefined, 'createTask')}
      >
        +
      </div>
      <div className="taskList">{rows}</div>
    </div>
  );
}

export default DatedList;
