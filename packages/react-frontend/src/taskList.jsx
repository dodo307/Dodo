import TripleDots from './assets/three-dots-vertical.svg';
import Task from './task.jsx';
import TagList from './tagList.jsx';

function TaskList(props) {
  // Check/uncheck a task given its id.
  function checkTask(event, id) {
    const index = props.list.findIndex(task => task._id == id);
    const task = props.list[index];
    task.checked = event.currentTarget.checked;
    // TODO: props.list[index] = new Task generated from updateTask(task._id, task) from the backend/database
    props.updateList([...props.list]);
  }

  // Given an id of a task and the new tag list, apply the tag list to the task
  function updateTags(id, tags) {
    const index = props.list.findIndex(task => task._id == id);
    const task = props.list[index];
    task.tags = tags;
    // TODO: props.list[index] = new Task generated from updateTask(task._id, task) from the backend/database
    props.updateList([...props.list]);
  }

  // Choose what kind of task to add upon clicking the + button based on if the list is a dated list or not
  function addOnClick() {
    const newTask = new Task(
      'Untitled task',
      [],
      '',
      props.currentDate ? new Date(props.currentDate) : undefined
    );
    props.createTask(newTask);
  }

  // For each task that passes the filter
  const rows = props.list
    .filter(props.filterFunc)
    .filter(x => !props.currentDate || x.date.toDateString() == props.currentDate.toDateString())
    .map(x => {
      console.log(x.toJSON());
      // If the date of the task doesn't match the current date, don't return anything
      if (props.currentDate && x.date.toDateString() != props.currentDate.toDateString()) return;

      return (
        // Each task gets its own div. Add "checkedTask" class if the task is checked to show it checked off.
        <div key={x._id} className={x.checked ? 'task checkedTask' : 'task'}>
          <h4>{x.title}</h4>
          {/* Display the time attributed to the task if exists */}
          {x.date ? (
            <p className="time" style={{ display: x.date.getSeconds() ? 'none' : '' }}>
              {((x.date.getHours() + 11) % 12) + 1}:{String(x.date.getMinutes()).padStart(2, '0')}{' '}
              {x.date.getHours() >= 12 ? 'PM' : 'AM'}
            </p>
          ) : (
            <></>
          )}
          {/* List the tags of the task */}
          <TagList
            tags={x.tags}
            updateTags={updateTags.bind(undefined, x._id)}
            filter={props.filter}
            setFilter={props.setFilter}
            mode="filter"
          />
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
      );
    });

  return (
    <div className="taskListWrapper">
      {/* Plus button to add new tasks */}
      <div className="addTask unselectableText" onClick={addOnClick}>
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

export default TaskList;
