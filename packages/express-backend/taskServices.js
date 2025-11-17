import mongoose from 'mongoose';
import taskModel from './task.js';

mongoose.set('debug', true);

function getTasks(userID, tagsArray) {
  if (tagsArray) {
    return taskModel.find({ userID: userID, tags: { $in: tagsArray } });
  } else {
    return taskModel.find({ userID: userID });
  }userID
}

function findTaskById(taskID, userID) {
  return taskModel.find({ _id: taskID, userID: userID });
}

function addTask(task) {
  const taskToAdd = new taskModel(task);
  const promise = taskToAdd.save();
  return promise;
}

function deleteTask(taskID, userID) {
  const promise = taskModel.deleteOne({ _id: taskID, userID: userID });
  return promise;
}

function updateTask(taskID, userID, task) {
  return taskModel.find({ _id: taskID, userID: userID }).updateOne(task);
}

export { getTasks, findTaskById, addTask, deleteTask, updateTask };
