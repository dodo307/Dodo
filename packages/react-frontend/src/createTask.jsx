import { useState } from 'react';
import { Task } from './App.jsx';

function CreateTask(props) {
  const [task, setTask] = useState(new Task('Untitled Task'));

  function handleChange(event) {
    const { name, value } = event.target;

    let newTask = {};
    Object.assign(newTask, task);
    newTask[name] = value;
    setTask(newTask);
  }

  function addTask() {
    console.log('Add task here lmao');
    props.setPage('main');
  }

  return (
    <div id="createTask" className="window">
      <form>
        <label htmlFor="name">Title</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Untitled Task"
          value={task.name}
          onChange={handleChange}
        />
        <label htmlFor="desc">Description</label>
        <input
          type="text"
          name="desc"
          id="desc"
          placeholder="Add a description here"
          value={task.desc}
          onChange={handleChange}
        />
        <input type="button" value="Add Task" onClick={addTask} />
      </form>
    </div>
  );
}

export default CreateTask;
