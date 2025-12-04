import './loadEnv.js';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Capture the original environment so each test can tweak process.env safely.
const originalEnv = { ...process.env };

const createApp = () => ({
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  listen: jest.fn((_port, callback) => callback && callback()),
});

let appInstance;
const expressMock = jest.fn(() => appInstance);
const expressJsonMock = jest.fn();
expressMock.json = expressJsonMock;
jest.unstable_mockModule('express', () => ({
  default: expressMock,
}));

let corsMiddleware;
let recordedCorsOptions;
const corsMock = jest.fn(options => {
  recordedCorsOptions = options;
  return corsMiddleware;
});
jest.unstable_mockModule('cors', () => ({
  default: corsMock,
}));

const connectMongoMock = jest.fn();
jest.unstable_mockModule('../express-backend/dbConnection.js', () => ({
  default: connectMongoMock,
}));

const registerUserMock = jest.fn();
const loginUserMock = jest.fn();
const hintUserMock = jest.fn();
const updateUserWithHashMock = jest.fn();
jest.unstable_mockModule('../express-backend/auth.js', () => ({
  registerUser: registerUserMock,
  loginUser: loginUserMock,
  hintUser: hintUserMock,
  updateUserWithHash: updateUserWithHashMock,
}));

const deleteUserMock = jest.fn();
const getTagsMock = jest.fn();
const addTagMock = jest.fn();
const deleteTagMock = jest.fn();
const findUserMock = jest.fn();
jest.unstable_mockModule('../express-backend/userServices.js', () => ({
  deleteUser: deleteUserMock,
  getTags: getTagsMock,
  addTag: addTagMock,
  deleteTag: deleteTagMock,
  findUser: findUserMock,
}));

const getTasksMock = jest.fn();
const findTaskByIdMock = jest.fn();
const addTaskMock = jest.fn();
const deleteTaskMock = jest.fn();
const updateTaskMock = jest.fn();
jest.unstable_mockModule('../express-backend/taskServices.js', () => ({
  getTasks: getTasksMock,
  findTaskById: findTaskByIdMock,
  addTask: addTaskMock,
  deleteTask: deleteTaskMock,
  updateTask: updateTaskMock,
}));

// Helpers shared across the suite.
const flushPromises = () => new Promise(resolve => setImmediate(resolve));
const createRes = () => {
  const res = {
    status: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
    end: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
};
const findRoute = (mockFn, path) => {
  const match = mockFn.mock.calls.find(call => call[0] === path);
  return match ? match[1] : undefined;
};

describe('backend wiring', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.resetModules();
    jest.clearAllMocks();
    appInstance = createApp();
    expressMock.mockImplementation(() => appInstance);
    expressJsonMock.mockReturnValue('json-middleware');
    corsMiddleware = jest.fn();
    recordedCorsOptions = undefined;
    corsMock.mockImplementation(options => {
      recordedCorsOptions = options;
      return corsMiddleware;
    });
    connectMongoMock.mockResolvedValue();
    findUserMock.mockResolvedValue({ _id: 'user-1' });
    getTasksMock.mockResolvedValue([]);
    addTaskMock.mockResolvedValue({ _id: 'task-1' });
    deleteTaskMock.mockResolvedValue({ deletedCount: 1 });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('bootstraps express with cors, json parsing, and begins listening', async () => {
    process.env.PORT = '9000';
    process.env.CORS_ALLOWED_ORIGINS = 'https://site-a.com, https://site-b.com';
    await import('../express-backend/backend.js');
    expect(connectMongoMock).toHaveBeenCalledTimes(1);
    expect(expressMock).toHaveBeenCalledTimes(1);
    expect(appInstance.use).toHaveBeenCalledWith(corsMiddleware);
    expect(expressJsonMock).toHaveBeenCalledTimes(1);
    expect(appInstance.use).toHaveBeenCalledWith('json-middleware');
    expect(appInstance.listen).toHaveBeenCalledWith('9000', expect.any(Function));

    // The custom origin callback should allow configured origins and reject unlisted ones.
    const allowCallback = jest.fn();
    recordedCorsOptions.origin('https://site-a.com', allowCallback);
    expect(allowCallback).toHaveBeenCalledWith(null, true);

    const denyCallback = jest.fn();
    recordedCorsOptions.origin('https://unknown.com', denyCallback);
    expect(denyCallback).toHaveBeenCalledWith(expect.any(Error));
  });

  test('registers auth endpoints directly with express', async () => {
    await import('../express-backend/backend.js');
    expect(appInstance.post).toHaveBeenCalledWith('/signup', registerUserMock);
    expect(appInstance.post).toHaveBeenCalledWith('/login', loginUserMock);
    expect(appInstance.get).toHaveBeenCalledWith('/hint/:username', hintUserMock);
    expect(appInstance.put).toHaveBeenCalledWith('/users/:userID', updateUserWithHashMock);
  });

  test('GET /users routes results and errors through findUser', async () => {
    await import('../express-backend/backend.js');
    const handler = findRoute(appInstance.get, '/users');
    const req = { query: { userID: 'user-1', username: 'sam' } };
    const res = createRes();

    handler(req, res);
    await flushPromises();
    expect(findUserMock).toHaveBeenCalledWith('user-1', 'sam');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ _id: 'user-1' });

    const resFailure = createRes();
    findUserMock.mockRejectedValueOnce(new Error('boom'));
    handler(req, resFailure);
    await flushPromises();
    expect(resFailure.status).toHaveBeenCalledWith(404);
    expect(resFailure.send).toHaveBeenCalledWith('Resource not found');
  });

  test('GET /tasks/:userID forwards filters to the service layer', async () => {
    await import('../express-backend/backend.js');
    const handler = findRoute(appInstance.get, '/tasks/:userID');
    const req = { params: { userID: 'user-9' }, query: { tags: ['work'] } };
    const res = createRes();
    getTasksMock.mockResolvedValueOnce([{ _id: 't1' }]);

    handler(req, res);
    await flushPromises();
    expect(getTasksMock).toHaveBeenCalledWith('user-9', ['work']);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([{ _id: 't1' }]);
  });

  test('POST /tasks persists the incoming body', async () => {
    await import('../express-backend/backend.js');
    const handler = findRoute(appInstance.post, '/tasks');
    const req = { body: { title: 'Test' } };
    const res = createRes();
    addTaskMock.mockResolvedValueOnce({ _id: 't42' });

    handler(req, res);
    await flushPromises();
    expect(addTaskMock).toHaveBeenCalledWith({ title: 'Test' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ _id: 't42' });
  });

  test('DELETE /tasks/:taskID/:userID handles service failures', async () => {
    await import('../express-backend/backend.js');
    const handler = findRoute(appInstance.delete, '/tasks/:taskID/:userID');
    const req = { params: { taskID: 't1', userID: 'u1' } };
    const res = createRes();
    deleteTaskMock.mockRejectedValueOnce(new Error('db down'));

    handler(req, res);
    await flushPromises();
    expect(deleteTaskMock).toHaveBeenCalledWith('t1', 'u1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Resource not found');
  });
});
