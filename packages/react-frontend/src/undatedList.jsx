import TripleDots from './assets/three-dots-vertical.svg';

function UndatedList(props) {
  return (
    <div id="undatedListWrapper">
      <div id="undatedList">
        <h3>Undated</h3>
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
    console.log(newTasks);
  }

  const rows = props.list.map(x => (
    <div key={x.id} className={x.checked ? "checkedTask" : ""}>
      <h4>{x.title}</h4>
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
export default UndatedList;
