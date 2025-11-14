import TripleDots from './assets/three-dots-vertical.svg';
import Task from './task.jsx';

function DatedList(props) {
  const now = new Date();
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
  const now = new Date();

  function checkTask(event, id) {
    let index = props.list.findIndex(task => task.id == id);
    let newTasks = [...props.list];
    newTasks[index].checked = event.currentTarget.checked;
    props.updateList(newTasks);
  }

  const rows = props.list.filter(props.filter).map(x => {
    const taskDate = new Date(x.date.getTime());

    if (taskDate.toDateString() != now.toDateString()) return;

    return (
      <div key={x.id} className={x.checked ? 'task checkedTask' : 'task'}>
        <h4>{x.title}</h4>
        <p className="time">
          {((x.date.getHours() + 11) % 12) + 1}:{String(x.date.getMinutes()).padStart(2, '0')}{' '}
          {x.date.getHours() >= 12 ? 'PM' : 'AM'}
        </p>
        <div className="tagList" style={{ display: x.tags.length ? 'block' : 'none' }}>
          {x.tags.map(tag => (
            <div className="tag" name={tag}>
              #{tag}
            </div>
          ))}
        </div>
        {x.description ? <p className="description">{x.description}</p> : <></>}
        <input
          type="checkbox"
          checked={x.checked}
          onChange={event => checkTask(event, x.id)}
        ></input>
        <img className="tripleDots" src={TripleDots} onClick={() => props.createTask(x)}></img>
      </div>
    );
  });

  return (
    <div className="taskListWrapper">
      <div
        className="addTask unselectableText"
        onClick={() =>
          props.createTask(
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
