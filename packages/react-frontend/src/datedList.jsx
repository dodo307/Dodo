import TripleDots from './assets/three-dots-vertical.svg';

function DatedList(props) {
  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div id="datedListWrapper">
      <div id="datedList">
        <h4>Today</h4>
        <p>{dayNames[now.getDay()]} {monthNames[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</p>
        <Tasks list={props.list} setPage={props.setPage} />
      </div>
    </div>
  );
}

function Tasks(props) {
  const rows = props.list.map(x => (
    <div key={x.id}>
      <h4>{x.title}</h4>
      <p>{(x.date.getHours() - 1) % 12 + 1}:{x.date.getMinutes()} {x.date.getHours() >= 12 ? "PM" : "AM"}</p>
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
