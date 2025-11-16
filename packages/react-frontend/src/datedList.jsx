import TripleDots from './assets/three-dots-vertical.svg';
import Task from './task.jsx';
import TagList from './tagList.jsx';

function DatedList(props) {
  const now = new Date();
  // This stuff is for number to text don't worry about it too much
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div id="datedListWrapper">
      <div id="datedList">
        <h3>Today</h3>
        {/* Current Date shown in this <p> */}
        <p>
          <strong>{dayNames[now.getDay()]}</strong> <br /> {monthNames[now.getMonth()]}{' '}
          {now.getDate()}, {now.getFullYear()}
        </p>
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
  // TODO: Make this current date changable from the front end (allow moving to tomorrow, yesterday, etc.)
  const now = new Date();

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

  // For each task that passes the filter
  const rows = props.list.filter(props.filter).map(x => {
    const taskDate = new Date(x.date.getTime());

    // If the date of the task doesn't match the current date, don't return anything
    if (taskDate.toDateString() != now.toDateString()) return;

    return (
      // Each task gets its own div. Add "checkedTask" class if the task is checked to show it checked off.
      <div key={x._id} className={x.checked ? 'task checkedTask' : 'task'}>
        <h4>{x.title}</h4>
        {/* Display the time attributed to the task */}
        <p className="time">
          {((x.date.getHours() + 11) % 12) + 1}:{String(x.date.getMinutes()).padStart(2, '0')}{' '}
          {x.date.getHours() >= 12 ? 'PM' : 'AM'}
        </p>
        {/* List the tags of the task */}
        <TagList tags={x.tags} updateTags={updateTags.bind(undefined, x._id)} mode="filter" />
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
      <div
        className="addTask unselectableText"
        onClick={() =>
          props.createTask(
            // Create new task with current date (with time set to the next minute divisible by 5)
            new Task(
              'Untitled task',
              [],
              '',
              new Date(Math.floor(Date.now() / 300000 + 1) * 300000)
            )
          )
        }
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

export default DatedList;
