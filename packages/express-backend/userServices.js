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

function userExists(username) {
  return userModel.exists({ username: username })
    .then((result) => result)
    .catch((_) => true); // !TODO: fail gracefully but is okay for now
}

function getHashedPassword(username) {
  return userModel.find({ username: username })
    .then((result) => result.password)
    .catch((_) => "") // !TODO: fail gracefully but is okay for now
}

export { 
  addUser, 
  deleteUser, 
  getTags, 
  addTag, 
  deleteTag, 
  userExists, 
  getHashedPassword 
};
