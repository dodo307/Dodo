import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
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
      type: Array[String],
      required: false,
      trim: true,
    },
  },
  { collection: 'tasks_list' }
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;
