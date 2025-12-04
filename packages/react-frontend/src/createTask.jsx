import { useState, useRef } from 'react';
import TagList from './tagList';
import { addTask, deleteTask, updateTask } from './requests';

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

function CreateTask(props) {
  // Task data object. Allows safe editing of data without affecting the original
  const [taskData, setTaskData] = useState(props.task.current.getData());
  // Bool to display confirmation window
  const [confirmation, setConfirmation] = useState(false);
  // Time value for time input
  const timeValue = useRef(
    taskData.date?.getSeconds() == 0 ? taskData.date.toTimeString().slice(0, 5) : ''
  );

  // Every time a field changes
  function handleChange(event) {
    const { name, value } = event.target;

    const newTask = { ...taskData };
    // These are outside the switch case statement because lint hates variables being declared inside the case statements apparently
    let date = value.split('-'); // NOT ALWAYS A CORRECT VALUE
    let time = value.split(':'); // NOT ALWAYS A CORRECT VALUE
    switch (name) {
      case 'date': // Date: set day, month, and year of taskData.date
        if (!value) {
          newTask.date = undefined;
          break;
        }
        if (!newTask.date) {
          // If date doesn't exist, create one
          newTask.date = new Date(59000);
          // If there's a valid time, apply it
          if (timeValue.current) {
            time = timeValue.current.split(':');
            time.push(0);
            newTask.date.setHours(...time);
          }
        }
        date[1]--;
        newTask.date.setFullYear(...date);
        break;
      case 'time': // Time: set hours of taskData.date
        timeValue.current = value;
        if (!newTask.date) break; // Don't do anything if date doesn't exist
        if (!value) {
          newTask.date?.setSeconds(59);
          break;
        }
        time.push(0);
        newTask.date.setHours(...time);
        break;
      default: // Default: taskData property = value
        newTask[name] = value;
    }
    setTaskData(newTask);
  }

  // Set taskData tags to new list of tags
  function updateTags(tags) {
    const newTask = { ...taskData };
    newTask.tags = tags;
    setTaskData(newTask);
  }

  // Cancel/Delete button onClick
  function cancelTask() {
    if (props.newTask) {
      returnToMain();
    } else {
      setConfirmation(true);
    }
  }

  // Given a task list (array) create a new array and add the current task to it if it's not already there.
  function saveTaskToList(task, oldId, list) {
    const index = list.findIndex(t => t._id == oldId);
    console.log(index);
    if (index < 0) {
      // If does not exist, push to list (Create)
      list.push(task);
    } else {
      // Otherwise, replace the existing task with the new updated data (Update)
      list.splice(index, 1, task);
    }
    return [...list];
  }

  // Remove the task from the other list if it was there previously
  function removeTaskFromList(oldId, list) {
    const index = list.findIndex(t => t._id == oldId);
    if (index >= 0) {
      // If found, remove from list (Delete)
      list.splice(index, 1);
    }
    return [...list];
  }

  // Apply taskData to current task and update it to the correct task list
  function saveTask() {
    const oldId = taskData.id;
    // Apply task data to current task (usually dangerous but it's ok since we guarentee a rerender of the task lists)
    props.task.current.applyData(taskData);
    // Determine which operation to call depending on if this is task creation or task update
    let promise = undefined;
    if (props.newTask) {
      promise = addTask;
    } else {
      promise = updateTask;
    }

    promise(props.task.current).then(newTask => {
      if (newTask.date) {
        // If dated task, remove (or fizzle if not present) from undated list and add/update to dated list
        props.setUndatedList(removeTaskFromList.bind(undefined, oldId));
        props.setDatedList(saveTaskToList.bind(undefined, newTask, oldId));
        props.setDefaultDate(newTask.date);
      } else {
        // Otherwise, remove (or fizzle if not present) from dated list and add/update to undated list
        props.setDatedList(removeTaskFromList.bind(undefined, oldId));
        props.setUndatedList(saveTaskToList.bind(undefined, newTask, oldId));
      }
      returnToMain();
    });
  }

  // Remove tasks from any list. I'm lazy and didn't want to do logic
  function removeTask() {
    const oldId = taskData.id;
    deleteTask(props.task.current).then(() => {
      props.setDatedList(removeTaskFromList.bind(undefined, oldId));
      props.setUndatedList(removeTaskFromList.bind(undefined, oldId));
    });
    returnToMain();
  }

  // Return to main page. Here in case more complex behaviour needs to be done when going back
  function returnToMain() {
    props.setPage('main');
  }

  return (
    <>
      <div
        id="createTask"
        className="window"
        style={confirmation ? { filter: 'brightness(0.5)' } : {}}
      >
        {/* Cross button to exit and return to main page */}
        <div id="cross" onClick={returnToMain}>
          &#10005;
        </div>
        {/* Form for the window */}
        <form onSubmit={e => e.preventDefault()}>
          {/* Stop the form from auto submitting upon enter */}
          {/* Task title */}
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Untitled Task"
            value={taskData.title}
            onChange={handleChange}
          />
          {/* Task date if the task is a dated task. Otherwise display nothing */}
          <DateTime taskData={taskData} handleChange={handleChange} timeValue={timeValue} />
          {/* Task location (optional) */}
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Optional"
            value={taskData.location}
            onChange={handleChange}
          />
          {/* Tag List */}
          <label htmlFor="tags">Tags</label>
          <div className="tagListWrapper">
            <TagList
              tags={taskData.tags}
              updateTags={updateTags}
              mode="edit"
              blurBehavior="submit"
            />
          </div>
          {/* Task description */}
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            placeholder="Add a description here"
            value={taskData.description}
            onChange={handleChange}
            style={{ resize: 'none' }}
          />
          {/* Submit button */}
          <input type="button" value="Save Task" onClick={saveTask} />
          {/* Delete/Cancel button */}
          <input
            type="button"
            className={props.newTask ? '' : 'redButton'}
            value={props.newTask ? 'Cancel' : 'Delete Task'}
            onClick={cancelTask}
          />
        </form>
      </div>
      {/* Confirmation window and div for disabling createTask window */}
      {confirmation ? (
        <>
          {/* Div to disable interaction with the original window */}
          <div
            style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
          ></div>
          {/* The actual confiramtion window itself */}
          <div id="confirmation" className="window">
            {/* Cross button to exit and return to main page */}
            <div id="cross" onClick={() => setConfirmation(false)}>
              &#10005;
            </div>
            <form>
              <label>
                Are you sure you want to delete this task?
                <br />
                <b>NOTE: This action can not be undone!</b>
              </label>
              <input type="button" className="redButton" value="Yes" onClick={removeTask} />
              <input type="button" value="No" onClick={() => setConfirmation(false)} />
            </form>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

// Component to allow date and time editing
function DateTime(props) {
  const currDate = props.taskData.date;

  return (
    <>
      <label htmlFor="date">Date & Time</label>
      {/* Date (Year, Month, Day) */}
      <input
        type="date"
        name="date"
        id="date"
        value={dateInputFormat(currDate)}
        onChange={props.handleChange}
      />
      {/* Time (Hour, Min) */}
      <input
        type="time"
        name="time"
        id="time"
        step="300"
        // If seconds is not 0, there is no exact time
        value={props.timeValue.current}
        onChange={props.handleChange}
      />
      <div>
        Saved Date: <b>{customDateToStr(currDate)}</b>
      </div>
    </>
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

// Helper function to get a custom date string from a Date object
function customDateToStr(date) {
  // Return "None" if date is undefined/null
  if (!date) return 'None';
  let result = '';
  if (date?.getSeconds() == 0) {
    // If the date has a time, add the hours, minutes, and AM/PM
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    result +=
      ((date.getHours() + 11) % 12) +
      1 +
      ':' +
      String(date.getMinutes()).padStart(2, '0') +
      ' ' +
      ampm +
      ' ';
  } else {
    // Otherwise state that this task in untimed
    result += '(No Time) ';
  }
  // Add the rest of the date text
  result += dayNames[date.getDay()] + ' ';
  result += monthNames[date.getMonth()] + ' ';
  result += date.getDate() + ', ';
  result += date.getFullYear();
  return result;
}

export default CreateTask;
