import { useState } from 'react';
import TagList from './tagList';

function CreateTask(props) {
  const [taskData, setTaskData] = useState(props.task.current.getData());

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
        newTask.date = newTask.date || new Date(59000);
        date[1]--;
        newTask.date.setFullYear(...date);
        break;
      case 'time': // Time: set hours of taskData.date
        if (!value) {
          newTask.date?.setSeconds(59);
          break;
        }
        newTask.date = newTask.date || new Date(59000);
        time.push(0);
        newTask.date.setHours(...time);
        break;
      default: // Default: taskData property = value
        newTask[name] = value;
    }
    setTaskData(newTask);
  }

  function updateTags(tags) {
    const newTask = { ...taskData };
    newTask.tags = tags;
    setTaskData(newTask);
  }

  // Given a task list (array) create a new array and add the current task to it if it's not already there.
  function saveTaskToList(list) {
    const task = props.task.current;
    const index = list.findIndex(t => t._id == task._id);
    if (index < 0) {
      // TODO: task = new Task generated from addTask(task) from the backend/database
      list.push(task);
    } else {
      // TODO: task = new Task generated from updateTask(task._id, task) from the backend/database
    }
    return [...list];
  }

  // Remove the task from the other list if it was there previously
  function removeTaskFromList(list) {
    const task = props.task.current;
    const index = list.findIndex(t => t._id == task._id);
    if (index >= 0) {
      // TODO: removeTasks(task) from the backend/database
      list.splice(index, 1);
    }
    return [...list];
  }

  // Apply taskData to current task and update it to the correct task list
  function saveTask() {
    props.task.current.applyData(taskData);
    console.log(props.task.current.date);
    if (props.task.current.date) {
      props.setUndatedList(removeTaskFromList);
      props.setDatedList(saveTaskToList);
    } else {
      props.setDatedList(removeTaskFromList);
      props.setUndatedList(saveTaskToList);
    }
    returnToMain();
  }

  // Return to main page. Here in case more complex behaviour needs to be done when going back
  function returnToMain() {
    props.setPage('main');
  }

  return (
    <div id="createTask" className="window">
      {/* Cross button to exit and return to main page */}
      <div id="cross" onClick={returnToMain}>
        &#10005;
      </div>
      {/* Form for the window */}
      <form onSubmit={e => e.preventDefault()}>
        {' '}
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
        <DateTime taskData={taskData} handleChange={handleChange} />
        {/* Tag List */}
        <label htmlFor="tags">Tags</label>
        <div className="tagListWrapper">
          <TagList tags={taskData.tags} updateTags={updateTags} mode="edit" />
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
      </form>
    </div>
  );
}

// Component to allow date and time editing
function DateTime(props) {
  return (
    <>
      <label htmlFor="date">Date & Time</label>
      {/* Date (Year, Month, Day) */}
      <input
        type="date"
        name="date"
        id="date"
        value={dateInputFormat(props.taskData.date)}
        onChange={props.handleChange}
      />
      {/* Time (Hour, Min) */}
      <input
        type="time"
        name="time"
        id="time"
        step="300"
        // If seconds is not 0, there is no exact time
        value={
          props.taskData.date?.getSeconds() == 0
            ? props.taskData.date.toTimeString().slice(0, 5)
            : ''
        }
        onChange={props.handleChange}
      />
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

export default CreateTask;
