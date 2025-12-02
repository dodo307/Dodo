import './loadEnv.js';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock the mongoose model methods so tests never hit the real database.
const findMock = jest.fn().mockResolvedValue([]);
const deleteOneMock = jest.fn().mockResolvedValue({ deletedCount: 1 });
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
  TaskModelMock.deleteOne = deleteOneMock;

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
  });

  test('getTasks fetches every task when no filter is supplied', async () => {
    const userID = 'user-1';
    await getTasks(userID);
    expect(findMock).toHaveBeenCalledTimes(1);
    expect(findMock).toHaveBeenCalledWith({ userID });
  });

  test('getTasks filters by provided tags', async () => {
    const userID = 'user-2';
    const tags = ['school', 'urgent'];
    await getTasks(userID, tags);
    expect(findMock).toHaveBeenCalledWith({ userID, tags: { $in: tags } });
  });

  test('findTaskById forwards the id to the model', async () => {
    await findTaskById('abc123', 'user-3');
    expect(findMock).toHaveBeenCalledWith({ _id: 'abc123', userID: 'user-3' });
  });

  test('addTask constructs and saves a task document', async () => {
    const payload = { title: 'Write tests', tags: [] };
    await addTask(payload);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  test('deleteTask deletes by id', async () => {
    await deleteTask('del-1', 'user-4');
    expect(deleteOneMock).toHaveBeenCalledWith({ _id: 'del-1', userID: 'user-4' });
  });

  test('updateTask updates the stored document', async () => {
    const updates = { title: 'Updated title' };
    findMock.mockImplementationOnce(() => ({ updateOne: updateOneMock }));
    await updateTask('task-9', 'user-5', updates);
    expect(findMock).toHaveBeenCalledWith({ _id: 'task-9', userID: 'user-5' });
    expect(updateOneMock).toHaveBeenCalledWith(updates);
  });
});
