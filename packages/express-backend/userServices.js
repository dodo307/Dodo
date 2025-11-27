import mongoose from 'mongoose';
import userModel from './user.js';

mongoose.set('debug', true);

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function updateUser(userID, user) {
  return userModel.find({ _id: userID }).updateOne(user);
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

/// result will be null if it doesn't exist and contains the user id if it does
async function userExists(username) {
  const result = await userModel.exists({ username });
  return Boolean(result);
}

async function getHashedPassword(username) {
  const hashedPass = await userModel.findOne({ username: username }, 'password -_id');
  return hashedPass ? hashedPass.password : '';
}

function findUserByUsername(username) {
  return userModel.find({ username: username });
}

function findUserById(id) {
  return userModel.findById(id);
}

export {
  addUser,
  deleteUser,
  updateUser,
  getTags,
  addTag,
  deleteTag,
  userExists,
  getHashedPassword,
  findUserByUsername,
  findUserById,
};
