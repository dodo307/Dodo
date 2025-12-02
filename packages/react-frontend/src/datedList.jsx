import { useState, useRef } from 'react';
import TaskList from './taskList.jsx';

const ONE_DAY = 86400000; // One day in ms

function DatedList(props) {
  const now = new Date(new Date().setHours(0, 0, 0, 0)); // Get current day, month, year. (Weird JS shenanigans)
  const [currDate, setCurrDate] = useState(now); // Set current date to today
  const dateInput = useRef(undefined); // Reference of the input element for date changing
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

  // Change date when date picker is submitted
  function changeDate(event) {
    const value = event.target.value;
    const date = value.split('-');
    if (!value) {
      setCurrDate(now);
      return;
    }
    date[1]--;
    setCurrDate(d => new Date(d.setFullYear(...date)));
  }

  // String of the current date
  let dateString = `${monthNames[currDate.getMonth()]} ${currDate.getDate()}, ${currDate.getFullYear()}`;
  // Day of week string
  let dayString = dayNames[currDate.getDay()];
  // Header (text inside h3)
  let header = undefined;

  // Get times now to reference them later
  const nowTime = now.getTime();
  const currTime = currDate.getTime();
  const nowDay = now.getDay(); // Now day of week

  if (nowTime == currTime)
    header = 'Today'; // Check if today
  else if (nowTime - ONE_DAY == currTime)
    header = 'Yesterday'; // Check if yesterday
  else if (nowTime + ONE_DAY == currTime)
    header = 'Tomorrow'; // Check if tomorrow
  // Check if this week
  else if (nowTime - ONE_DAY * nowDay <= currDate && nowTime + ONE_DAY * (7 - nowDay) > currDate) {
    header = `This ${dayString}`;
    dayString = '';
    // Check if next week
  } else if (
    nowTime + ONE_DAY * (7 - nowDay) <= currDate &&
    nowTime + ONE_DAY * (14 - nowDay) > currDate
  ) {
    header = `Next ${dayString}`;
    dayString = '';
    // Check if last week
  } else if (
    nowTime - ONE_DAY * (7 + nowDay) <= currDate &&
    nowTime - ONE_DAY * nowDay > currDate
  ) {
    header = `Last ${dayString}`;
    dayString = '';
  }

  // If header still not generated, use the current day of the week
  if (!header) {
    header = dayString;
    dayString = '';
  }

  // Open date picker when changeDate is clicked
  function openDatePicker(e) {
    e.preventDefault();
    dateInput.current.showPicker();
  }

  return (
    <div id="datedListWrapper">
      <div id="datedList">
        <h3>{header}</h3>
        {/* Date change button/span */}
        <span id="changeDate" onClick={openDatePicker}>
          Change Date
          <input
            ref={dateInput}
            type="date"
            value={dateInputFormat(currDate)}
            onChange={changeDate}
          />
        </span>
        {/* Current Date shown in this <p> */}
        <p>
          {dayString ? (
            <>
              <strong>{dayString}</strong> <br />
            </>
          ) : (
            <></>
          )}
          {dateString}
        </p>
        <TaskList
          list={props.list.toSorted((x, y) => x.date - y.date)}
          filter={props.filter}
          setFilter={props.setFilter}
          filterFunc={props.filterFunc}
          createTask={props.createTask}
          updateList={props.updateList}
          setPage={props.setPage}
          currentDate={currDate}
        />
      </div>
    </div>
  );
}

// Helper function to turn Date object into html <input type="date"> value format
function dateInputFormat(date) {
  if (!date) return '';
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default DatedList;
