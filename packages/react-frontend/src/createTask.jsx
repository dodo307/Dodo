import { useState } from 'react';
import { Task } from './App.jsx';

function CreateTask(props) {
  console.log(props.task.current);
  const [taskData, setTaskData] = useState(props.task.current.getData());

  function handleChange(event) {
    const { name, value } = event.target;

    let newTask = { ...taskData };
    switch (name) {
      case 'date':
        let date = value.split('-');
        date[1]--;
        newTask.date.setFullYear(...date);
        break;
      case 'time':
        console.log(newTask.date);
        console.log(value);
        newTask.date.setHours(...value.split(':'));
        break;
      default:
        newTask[name] = value;
    }
    setTaskData(newTask);
  }

  function saveTaskToList(list) {
    const index = list.findIndex(task => task.id == props.task.current.id);
    const result = [...list];
    if (index < -1) {
      result.push(props.task.current);
    }
    console.log(result[0]);
    console.log(result[1]);
    return result;
  }

  function saveTask() {
    console.log('Add task here lmao');
    props.task.current.applyData(taskData);
    if (props.task.current.dated) {
      props.setDatedList(saveTaskToList);
    } else {
      props.setUndatedList(saveTaskToList);
    }
    returnToMain();
  }

  function returnToMain() {
    props.setPage('main');
  }

  return (
    <div id="createTask" className="window">
      <div id="cross" onClick={returnToMain}>
        &#10005;
      </div>
      <form>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Untitled Task"
          value={taskData.title}
          onChange={handleChange}
        />
        {taskData.date ? <DateTime taskData={taskData} handleChange={handleChange} /> : <></>}
        <label htmlFor="desc">Description</label>
        <input
          type="text"
          name="desc"
          id="desc"
          placeholder="Add a description here"
          value={taskData.desc}
          onChange={handleChange}
        />
        <input type="button" value="Save Task" onClick={saveTask} />
      </form>
    </div>
  );
}

function DateTime(props) {
  if (!props.taskData.date) return;
  return (
    <>
      <label htmlFor="date">Date & Time</label>
      <input
        type="date"
        name="date"
        id="date"
        value={dateInputFormat(props.taskData.date)}
        onChange={props.handleChange}
      />
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

function dateInputFormat(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default CreateTask;
