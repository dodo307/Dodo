import mongoose from 'mongoose';
import userModel from './user.js';

mongoose.set('debug', true);

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function deleteUser(id) {
  const promise = userModel.findByIdAndDelete(id);
  return promise;
}

function getTags(id) {
  return userModel.findById(id, 'tags');
}

async function addTag(id, tag) {
  const result = userModel.findByIdAndUpdate(id, { $push: { tags: tag } });
  return result;
}

function deleteTag(id, tag) {
  const result = userModel.findByIdAndUpdate(id, { $pull: { tags: tag } });
  return result;
}

async function userExists(username) {
  const result = await userModel.exists({ username });
  return result;
}

async function getHashedPassword(username) {
  const hashedPass = await userModel.findOne({ username: username }, 'password -_id');
  return hashedPass.password;
}

export { addUser, deleteUser, getTags, addTag, deleteTag, userExists, getHashedPassword };
