import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    pwdHint: {
      type: String,
      required: true,
      trim: false,
    },
    tags: {
      type: [String],
      required: false,
      trim: true,
    },
  },
  { collection: 'users_list' }
);

const User = mongoose.model('User', UserSchema);

export default User;
