import mongoose from 'mongoose';
import { Types } from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    userID: {
      type: Types.ObjectId,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    date: {
      type: Date,
      required: false,
      trim: true,
    },
    tags: {
      type: [String],
      required: false,
      trim: true,
    },
    completed: {
      type: Boolean,
      required: true,
      trim: false
    }
  },
  { collection: 'tasks_list' }
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;
