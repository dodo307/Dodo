import { useState } from 'react';
import TagList from './tagList';

function CreateTask(props) {
  const [taskData, setTaskData] = useState(props.task.current.getData());

  // Every time a field changes
  function handleChange(event) {
    const { name, value } = event.target;

    const newTask = { ...taskData };
    switch (name) {
      case 'date': // Date: set day, month, and year of taskData.date
        let date = value.split('-');
        date[1]--;
        newTask.date.setFullYear(...date);
        break;
      case 'time': // Time: set hours of taskData.date
        newTask.date.setHours(...value.split(':'));
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
    const index = list.findIndex(task => task._id == props.task.current._id);
    const result = [...list];
    if (index < 0) {
      result.push(props.task.current);
      // TODO: DB Add task
    } else {
      // TODO: DB Update task
    }
    return result;
  }

  // Apply taskData to current task and update it to the correct task list
  function saveTask() {
    props.task.current.applyData(taskData);
    if (props.task.current.dated) {
      props.setDatedList(saveTaskToList);
    } else {
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
      <form>
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
        {taskData.date ? <DateTime taskData={taskData} handleChange={handleChange} /> : <></>}
        <label htmlFor="tags">Tags</label>
        <TagList tags={taskData.tags} updateTags={updateTags} />
        {/* Task description */}
        <label htmlFor="description">Description</label>
        <textarea
          type="text"
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
        value={props.taskData.date.toTimeString().slice(0, 5)}
        onChange={props.handleChange}
      />
    </>
  );
}

// Helper function to turn Date object into html <input type="date"> value format
function dateInputFormat(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default CreateTask;
