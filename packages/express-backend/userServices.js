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
  /// no clue
  console.log(id + ' ' + tag);
}

function deleteTag(id, tag) {
  const result = userModel.findByIdAndUpdate(id, { $pull: { tags: tag } });
  return result;
}

export { addUser, deleteUser, getTags, addTag, deleteTag };
