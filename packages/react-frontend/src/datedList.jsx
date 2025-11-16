import TaskList from './taskList.jsx';

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
        <TaskList
          list={props.list}
          filter={props.filter}
          createTask={props.createTask}
          updateList={props.updateList}
          setPage={props.setPage}
          currentDate={new Date()}
        />
      </div>
    </div>
  );
}

export default DatedList;
