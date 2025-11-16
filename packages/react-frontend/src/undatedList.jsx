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
  // Check/uncheck a task given its id.
  function checkTask(event, id) {
    let index = props.list.findIndex(task => task._id == id);
    let newTasks = [...props.list];
    newTasks[index].checked = event.currentTarget.checked;
    props.updateList(newTasks);
  }

  // For each task that passes the filter
  const rows = props.list.filter(props.filter).map(x => (
    // Each task gets its own div. Add "checkedTask" class if the task is checked to show it checked off.
    <div key={x._id} className={x.checked ? 'task checkedTask' : 'task'}>
      <h4>{x.title}</h4>
      {/* List the tags of the task */}
      <div className="tagList">
        {x.tags.map(tag => (
          <div className="tag" key={tag}>
            #{tag}
          </div>
        ))}
      </div>
      {/* Don't display the description if there is nothing to display */}
      {x.description ? <p className="description">{x.description}</p> : <></>}
      {/* Checkbox to check off tasks */}
      <input
        type="checkbox"
        checked={x.checked}
        onChange={event => checkTask(event, x._id)}
      ></input>
      {/* Triple dots to make edits to task */}
      <img className="tripleDots" src={TripleDots} onClick={() => props.createTask(x)}></img>
    </div>
  ));

  return (
    <div className="taskListWrapper">
      {/* Plus button to add new tasks */}
      <div
        className="addTask unselectableText"
        onClick={() => props.createTask(new Task('Untitled Task'))}
      >
        +
      </div>
      {/* List tasks. Display emptyListText if there are no rows in the list */}
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
