import TripleDots from './assets/three-dots-vertical.svg';
import Task from './task.jsx';

function UndatedList(props) {
  return (
    <div id="undatedListWrapper">
      <div id="undatedList">
        <h3>Undated</h3>
        <Tasks
          list={props.list}
          filter={props.filter}
          createTask={props.createTask}
          updateList={props.updateList}
          setPage={props.setPage}
        />
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

  console.log(props.list);

  const rows = props.list.filter(props.filter).map(x => (
    <div key={x.id} className={x.checked ? 'task checkedTask' : 'task'}>
      <h4>{x.title}</h4>
      <div className="tagList">
        {x.tags.map(tag => (
          <div className="tag" name={tag}>
            #{tag}
          </div>
        ))}
      </div>
      {x.description ? <p className="description">{x.description}</p> : <></>}
      <input type="checkbox" checked={x.checked} onChange={event => checkTask(event, x.id)}></input>
      <img className="tripleDots" src={TripleDots} onClick={() => props.createTask(x)}></img>
    </div>
  ));

  return (
    <div className="taskListWrapper">
      <div
        className="addTask unselectableText"
        onClick={() => props.createTask(new Task('Untitled Task'))}
      >
        +
      </div>
      {rows.length ? (
        <div className="taskList">{rows}</div>
      ) : (
        <div className="emptyListText">
          No tasks to list. Click the plus button to create tasks!
        </div>
      )}
    </div>
  );
}
export default UndatedList;
