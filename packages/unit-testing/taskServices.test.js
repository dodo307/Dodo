import './loadEnv.js';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock the mongoose model methods so tests never hit the real database.
const findMock = jest.fn().mockResolvedValue([]);
const findByIdMock = jest.fn();
const findByIdAndDeleteMock = jest.fn().mockResolvedValue({ deletedCount: 1 });
const updateOneMock = jest.fn().mockResolvedValue({ acknowledged: true });
const saveMock = jest.fn().mockResolvedValue({ _id: 'task-id' });

// Replace task.js with a test double whose static methods we can assert on.
jest.unstable_mockModule('../express-backend/task.js', () => {
  class TaskModelMock {
    constructor(doc) {
      this.doc = doc;
      this.save = saveMock;
    }
  }

  TaskModelMock.find = findMock;
  TaskModelMock.findById = findByIdMock;
  TaskModelMock.findByIdAndDelete = findByIdAndDeleteMock;

  return {
    default: TaskModelMock,
  };
});

// Import the functions under test after the mock is ready.
const { getTasks, findTaskById, addTask, deleteTask, updateTask } = await import(
  '../express-backend/taskServices.js'
);

describe('taskServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    findByIdMock.mockReturnValue({ updateOne: updateOneMock });
  });

  test('getTasks fetches every task when no filter is supplied', async () => {
    await getTasks();
    expect(findMock).toHaveBeenCalledTimes(1);
    expect(findMock).toHaveBeenCalledWith();
  });

  test('getTasks filters by provided tags', async () => {
    const tags = ['school', 'urgent'];
    await getTasks(tags);
    expect(findMock).toHaveBeenCalledWith({ tags: { $in: tags } });
  });

  test('findTaskById forwards the id to the model', async () => {
    await findTaskById('abc123');
    expect(findByIdMock).toHaveBeenCalledWith('abc123');
  });

  test('addTask constructs and saves a task document', async () => {
    const payload = { title: 'Write tests', tags: [] };
    await addTask(payload);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  test('deleteTask deletes by id', async () => {
    await deleteTask('del-1');
    expect(findByIdAndDeleteMock).toHaveBeenCalledWith('del-1');
  });

  test('updateTask updates the stored document', async () => {
    const updates = { title: 'Updated title' };
    await updateTask('task-9', updates);
    expect(findByIdMock).toHaveBeenCalledWith('task-9');
    expect(updateOneMock).toHaveBeenCalledWith(updates);
  });
});
