import mongoose from 'mongoose';
import taskModel from './task.js';

mongoose.set('debug', true);

function getTasks(tags) {
  console.log('get tasks with ' + tags);
}

function findTaskById(id) {
  console.log('find task with id ' + id);
}

function addTask(task) {
  console.log('add task: ' + task);
}

function deleteTask(id) {
  console.log('delete task with id ' + id);
}

function updateTask(task) {
  console.log('update task to ' + task);
}

export { getTasks, findTaskById, addTask, deleteTask, updateTask };
