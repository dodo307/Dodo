import TripleDots from './assets/three-dots-vertical.svg';

function DatedList(props) {
  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div id="datedListWrapper">
      <div id="datedList">
        <h3>Today</h3>
        <p><strong>{dayNames[now.getDay()]}</strong> <br /> {monthNames[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</p>
        <Tasks list={props.list} updateList={props.updateList} setPage={props.setPage} />
      </div>
    </div>
  );
}

function Tasks(props) {
  function checkTask(event, id) {
    let index = props.list.findIndex(task => task.id == id);
    let newTasks = [...props.list];
    newTasks[index].checked = event.currentTarget.checked;
    props.updateList(newTasks);
  }

  const rows = props.list.map(x => (
    <div key={x.id} className={x.checked ? "checkedTask" : ""}>
      <h4>{x.title}</h4>
      <p>{(x.date.getHours() - 1) % 12 + 1}:{String(x.date.getMinutes()).padStart(2, "0")} {x.date.getHours() >= 12 ? "PM" : "AM"}</p>
      <input type="checkbox" onChange={event => checkTask(event, x.id)}></input>
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
