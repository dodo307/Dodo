import mongoose from 'mongoose';
import userModel from './user.js';

mongoose.set('debug', true);

function addUser(user) {
  console.log('add user: ' + user);
}

function deleteUser(id) {
  console.log('delete user with id ' + id);
}

function getTags(id) {
  console.log('get tags for user with id ' + id);
  console.log('the optional tag was: ' + tag);
}

function addTag(id, tag) {
  console.log('add tag ' + tag + ' from user with id ' + id);
}

function deleteTag(id, tag) {
  console.log('delete tag ' + tag + ' from user with id ' + id);
}

export { addUser, deleteUser, getTags, addTag, deleteTag };
