import mongoose from 'mongoose';
import taskModel from './task.js';

mongoose.set('debug', true);

function getTasks(tagsArray) {
  if (tagsArray) {
    return taskModel.find({ tags: { $in: tagsArray } });
  } else {
    return taskModel.find();
  }
}

function findTaskById(id) {
  return taskModel.findById(id);
}

function addTask(task) {
  const taskToAdd = new taskModel(task);
  const promise = taskToAdd.save();
  return promise;
}

function deleteTask(id) {
  const promise = taskModel.findByIdAndDelete(id);
  return promise;
}

function updateTask(id, task) {
  return taskModel.findById(id).updateOne(task);
}

export { getTasks, findTaskById, addTask, deleteTask, updateTask };
