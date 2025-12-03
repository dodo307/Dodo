import './loadEnv.js';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock the mongoose model methods so tests never hit the real database.
const constructorMock = jest.fn();
const saveMock = jest.fn().mockResolvedValue({ _id: 'user-id' });
const findMock = jest.fn();
const findByIdMock = jest.fn();
const findByIdAndDeleteMock = jest.fn().mockResolvedValue({ deletedCount: 1 });
const findByIdAndUpdateMock = jest.fn().mockResolvedValue({ matchedCount: 1 });
const existsMock = jest.fn();
const updateOneMock = jest.fn().mockResolvedValue({ acknowledged: true });
const selectMock = jest.fn().mockReturnValue('selected');

// These helpers mimic how mongoose query objects can both be awaited and chained.
const findOneQueue = [];
const queueFindOneResult = value => {
  findOneQueue.push(value);
};
const createQueryResult = value => ({
  select: selectMock,
  then: (onFulfilled, onRejected) => Promise.resolve(value).then(onFulfilled, onRejected),
  catch: onRejected => Promise.resolve(value).catch(onRejected),
});
const defaultFindOneImpl = () =>
  createQueryResult(findOneQueue.length ? findOneQueue.shift() : undefined);
const findOneMock = jest.fn(defaultFindOneImpl);

// Replace user.js with a test double whose static methods we can assert on.
jest.unstable_mockModule('../express-backend/user.js', () => {
  class UserModelMock {
    constructor(doc) {
      constructorMock(doc);
      this.doc = doc;
      this.save = saveMock;
    }
  }

  UserModelMock.find = findMock;
  UserModelMock.findById = findByIdMock;
  UserModelMock.findByIdAndDelete = findByIdAndDeleteMock;
  UserModelMock.findByIdAndUpdate = findByIdAndUpdateMock;
  UserModelMock.exists = existsMock;
  UserModelMock.findOne = findOneMock;

  return {
    default: UserModelMock,
  };
});

// Import functions under test after setting up the mocks.
const {
  addUser,
  updateUser,
  deleteUser,
  getTags,
  addTag,
  deleteTag,
  userExists,
  getPwdHint,
  getHashedPassword,
  findUserByUsername,
  findUserById,
  findUser,
} = await import('../express-backend/userServices.js');

describe('userServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    selectMock.mockReturnValue('selected');
    findMock.mockReturnValue({ updateOne: updateOneMock });
    findOneQueue.length = 0;
    findOneMock.mockImplementation(defaultFindOneImpl);
  });

  test('addUser constructs and saves the incoming payload', async () => {
    const payload = { username: 'sam', password: 'secret', pwdHint: 'pet' };
    await addUser(payload);
    expect(constructorMock).toHaveBeenCalledWith(payload);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  test('updateUser forwards the id and patch to mongoose', async () => {
    const patch = { username: 'updated' };
    await updateUser('user-123', patch);
    expect(findMock).toHaveBeenCalledWith({ _id: 'user-123' });
    expect(updateOneMock).toHaveBeenCalledWith(patch);
  });

  test('deleteUser removes the document by id', async () => {
    await deleteUser('user-456');
    expect(findByIdAndDeleteMock).toHaveBeenCalledWith('user-456');
  });

  test('getTags fetches tags projection for the user', async () => {
    await getTags('user-789');
    expect(findByIdMock).toHaveBeenCalledWith('user-789', 'tags');
  });

  test('addTag pushes the new tag into the list', async () => {
    await addTag('user-abc', 'work');
    expect(findByIdAndUpdateMock).toHaveBeenCalledWith('user-abc', { $push: { tags: 'work' } });
  });

  test('deleteTag pulls the tag from the list', async () => {
    await deleteTag('user-abc', 'school');
    expect(findByIdAndUpdateMock).toHaveBeenCalledWith('user-abc', { $pull: { tags: 'school' } });
  });

  test('userExists returns true when a document is found', async () => {
    existsMock.mockResolvedValueOnce({ _id: 'user-1' });
    await expect(userExists('sam')).resolves.toBe(true);
    expect(existsMock).toHaveBeenCalledWith({ username: 'sam' });
  });

  test('userExists returns false when no document is found', async () => {
    existsMock.mockResolvedValueOnce(null);
    await expect(userExists('sam')).resolves.toBe(false);
  });

  test('getPwdHint returns the stored hint', async () => {
    queueFindOneResult({ pwdHint: 'dog name' });
    await expect(getPwdHint('sam')).resolves.toBe('dog name');
    expect(findOneMock).toHaveBeenCalledWith({ username: 'sam' }, 'pwdHint -_id');
  });

  test('getPwdHint falls back to an empty string when missing', async () => {
    queueFindOneResult(null);
    await expect(getPwdHint('sam')).resolves.toBe('');
  });

  test('getHashedPassword returns the stored hash', async () => {
    queueFindOneResult({ password: 'hashed' });
    await expect(getHashedPassword('sam')).resolves.toBe('hashed');
    expect(findOneMock).toHaveBeenCalledWith({ username: 'sam' }, 'password -_id');
  });

  test('getHashedPassword returns an empty string when not found', async () => {
    queueFindOneResult(null);
    await expect(getHashedPassword('sam')).resolves.toBe('');
  });

  test('findUserByUsername proxies the query to mongoose', () => {
    const query = {};
    findOneMock.mockImplementationOnce(() => query);
    const result = findUserByUsername('sam');
    expect(result).toBe(query);
    expect(findOneMock).toHaveBeenCalledWith({ username: 'sam' });
  });

  test('findUserById proxies the query to mongoose', () => {
    const query = {};
    findOneMock.mockImplementationOnce(() => query);
    const result = findUserById('user-xyz');
    expect(result).toBe(query);
    expect(findOneMock).toHaveBeenCalledWith({ _id: 'user-xyz' });
  });

  test('findUser fetches by id and username when both are provided', () => {
    const query = {};
    findOneMock.mockImplementationOnce(() => query);
    const result = findUser('user-1', 'sam');
    expect(result).toBe(query);
    expect(findOneMock).toHaveBeenCalledWith({ _id: 'user-1', username: 'sam' }, '-password');
  });

  test('findUser selects without password when only id is provided', () => {
    const selection = {};
    selectMock.mockReturnValueOnce(selection);
    const result = findUser('user-1');
    expect(findOneMock).toHaveBeenCalledWith({ _id: 'user-1' });
    expect(selectMock).toHaveBeenCalledWith('-password');
    expect(result).toBe(selection);
  });

  test('findUser selects without password when only username is provided', () => {
    const selection = {};
    selectMock.mockReturnValueOnce(selection);
    const result = findUser(undefined, 'sam');
    expect(findOneMock).toHaveBeenCalledWith({ username: 'sam' });
    expect(selectMock).toHaveBeenCalledWith('-password');
    expect(result).toBe(selection);
  });

  test('findUser defaults to querying a null id when neither filter is supplied', () => {
    const query = {};
    findOneMock.mockImplementationOnce(() => query);
    const result = findUser();
    expect(result).toBe(query);
    expect(findOneMock).toHaveBeenCalledWith({ _id: null });
  });
});
