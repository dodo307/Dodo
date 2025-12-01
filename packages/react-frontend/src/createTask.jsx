import { useState } from 'react';
import TagList from './tagList';
import { addTask, updateTask } from './requests';

function CreateTask(props) {
  const [taskData, setTaskData] = useState(props.task.current.getData());
  const [confirmation, setConfirmation] = useState(false);

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
      list.push(task);
    } else {
      list.splice(index, 1, task);
    }
    return [...list];
  }

  // Remove the task from the other list if it was there previously
  function removeTaskFromList(oldId, list) {
    const index = list.findIndex(t => t._id == oldId);
    if (index >= 0) {
      list.splice(index, 1);
    }
    return [...list];
  }

  // Apply taskData to current task and update it to the correct task list
  function saveTask() {
    const oldId = taskData.id;
    console.log(oldId);
    props.task.current.applyData(taskData);
    console.log(props.task.current);
    let promise = undefined;
    if (props.newTask) {
      promise = addTask;
    } else {
      promise = updateTask;
    }
    promise(props.task.current).then(newTask => {
      console.log(newTask.date);
      if (newTask.date) {
        console.log('removing from undated list');
        props.setUndatedList(removeTaskFromList.bind(undefined, oldId));
        props.setDatedList(saveTaskToList.bind(undefined, newTask, oldId));
      } else {
        console.log('removing from dated list');
        props.setDatedList(removeTaskFromList.bind(undefined, oldId));
        props.setUndatedList(saveTaskToList.bind(undefined, newTask, oldId));
      }
    });
    returnToMain();
  }

  // Remove tasks from any list. I'm lazy and didn't want to do logic
  function removeTask() {
    props.setDatedList(removeTaskFromList);
    props.setUndatedList(removeTaskFromList);
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
          <div
            style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
          ></div>
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
