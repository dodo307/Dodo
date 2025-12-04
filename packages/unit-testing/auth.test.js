import './loadEnv.js';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock bcrypt so hashing behavior can be asserted without touching the real lib.
const genSaltMock = jest.fn();
const hashMock = jest.fn();
const compareMock = jest.fn();
jest.unstable_mockModule('bcrypt', () => ({
  default: {
    genSalt: genSaltMock,
    hash: hashMock,
    compare: compareMock,
  },
}));

// Mock jsonwebtoken so token creation/verification is deterministic.
const signMock = jest.fn();
const verifyMock = jest.fn();
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: signMock,
    verify: verifyMock,
  },
}));

// Mock every user service that auth.js depends on.
const updateUserMock = jest.fn();
const userExistsMock = jest.fn();
const addUserMock = jest.fn();
const getHashedPasswordMock = jest.fn();
const getPwdHintMock = jest.fn();
const findUserByUsernameMock = jest.fn();
jest.unstable_mockModule('../express-backend/userServices.js', () => ({
  updateUser: updateUserMock,
  userExists: userExistsMock,
  addUser: addUserMock,
  getHashedPassword: getHashedPasswordMock,
  getPwdHint: getPwdHintMock,
  findUserByUsername: findUserByUsernameMock,
}));

// Import the module under test only after the mocks are ready.
const {
  registerUser,
  authenticateUser,
  loginUser,
  updateUserWithHash,
  hintUser,
} = await import('../express-backend/auth.js');

// Utility helper so we can await the chained promise callbacks inside the handlers.
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

describe('auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    genSaltMock.mockResolvedValue('salt');
    hashMock.mockResolvedValue('hashed-password');
    compareMock.mockResolvedValue(true);
    signMock.mockImplementation((_payload, _secret, _options, callback) => callback(null, 'jwt-token'));
    verifyMock.mockImplementation((_token, _secret, callback) => callback(null, { username: 'sam' }));
    userExistsMock.mockResolvedValue(false);
    addUserMock.mockResolvedValue({ _id: 'user-1', username: 'sam' });
    updateUserMock.mockResolvedValue('updated');
    getHashedPasswordMock.mockResolvedValue('stored-hash');
    findUserByUsernameMock.mockResolvedValue({ _id: 'user-1', username: 'sam' });
    getPwdHintMock.mockResolvedValue('first pet');
  });

  test('registerUser short-circuits on invalid payloads', () => {
    const req = { body: { username: 'sam', pwdHint: 'pet' } };
    const res = createRes();
    registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Bad request: Invalid input data.');
  });

  test('registerUser rejects duplicate usernames', async () => {
    const req = { body: { username: 'sam', pwd: 'pw', pwdHint: 'pet' } };
    const res = createRes();
    userExistsMock.mockResolvedValueOnce(true);
    registerUser(req, res);
    await flushPromises();
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith('Username already taken');
  });

  test('registerUser hashes and persists new accounts', async () => {
    const req = { body: { username: 'sam', pwd: 'pw', pwdHint: 'pet' } };
    const res = createRes();
    registerUser(req, res);
    await flushPromises();
    await flushPromises();
    await flushPromises();
    expect(genSaltMock).toHaveBeenCalledWith(10);
    expect(hashMock).toHaveBeenCalledWith('pw', 'salt');
    expect(addUserMock).toHaveBeenCalledWith({
      username: 'sam',
      password: 'hashed-password',
      pwdHint: 'pet',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      token: 'jwt-token',
      userID: 'user-1',
      username: 'sam',
    });
  });

  test('registerUser reports persistence failures', async () => {
    const req = { body: { username: 'sam', pwd: 'pw', pwdHint: 'pet' } };
    const res = createRes();
    addUserMock.mockRejectedValueOnce(new Error('db down'));
    registerUser(req, res);
    await flushPromises();
    await flushPromises();
    await flushPromises();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Unable to POST to resource');
  });

  test('authenticateUser rejects requests without a bearer token', () => {
    const req = { headers: {} };
    const res = createRes();
    const next = jest.fn();
    authenticateUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('authenticateUser calls next on valid JWTs', () => {
    const req = { headers: { authorization: 'Bearer abc' } };
    const res = createRes();
    const next = jest.fn();
    authenticateUser(req, res, next);
    expect(verifyMock).toHaveBeenCalledWith('abc', process.env.TOKEN_SECRET, expect.any(Function));
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('authenticateUser rejects invalid JWTs', () => {
    verifyMock.mockImplementationOnce((_token, _secret, callback) => callback(new Error('bad token')));
    const req = { headers: { authorization: 'Bearer bad' } };
    const res = createRes();
    const next = jest.fn();
    authenticateUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('loginUser validates the request body', () => {
    const req = { body: { username: 'sam' } };
    const res = createRes();
    loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Bad request: Invalid input data.');
  });

  test('loginUser rejects mismatched credentials', async () => {
    compareMock.mockResolvedValueOnce(false);
    const req = { body: { username: 'sam', pwd: 'pw' } };
    const res = createRes();
    loginUser(req, res);
    await flushPromises();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized');
  });

  test('loginUser surfaces bcrypt comparison failures', async () => {
    compareMock.mockRejectedValueOnce(new Error('bcrypt blew up'));
    const req = { body: { username: 'sam', pwd: 'pw' } };
    const res = createRes();
    loginUser(req, res);
    await flushPromises();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('loginUser returns a token for valid credentials', async () => {
    const req = { body: { username: 'sam', pwd: 'pw' } };
    const res = createRes();
    loginUser(req, res);
    await flushPromises();
    await flushPromises();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      token: 'jwt-token',
      userID: 'user-1',
      username: 'sam',
    });
  });

  test('updateUserWithHash re-hashes provided passwords', async () => {
    const req = { params: { userID: 'user-1' }, body: { password: 'new' } };
    const res = createRes();
    updateUserMock.mockResolvedValueOnce({ ok: 1 });
    updateUserWithHash(req, res);
    await flushPromises();
    await flushPromises();
    expect(genSaltMock).toHaveBeenCalledWith(10);
    expect(hashMock).toHaveBeenCalledWith('new', 'salt');
    expect(updateUserMock).toHaveBeenCalledWith('user-1', req.body);
    expect(req.body.password).toBe('hashed-password');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ ok: 1 });
  });

  test('updateUserWithHash skips hashing when the password is absent', async () => {
    const req = { params: { userID: 'user-1' }, body: { username: 'sam' } };
    const res = createRes();
    updateUserWithHash(req, res);
    await flushPromises();
    expect(genSaltMock).not.toHaveBeenCalled();
    expect(hashMock).not.toHaveBeenCalled();
    expect(updateUserMock).toHaveBeenCalledWith('user-1', req.body);
  });

  test('hintUser returns the stored hint', async () => {
    const req = { params: { username: 'sam' } };
    const res = createRes();
    hintUser(req, res);
    await flushPromises();
    expect(getPwdHintMock).toHaveBeenCalledWith('sam');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ hint: 'first pet' });
  });

  test('hintUser returns 404 when the hint is missing', async () => {
    getPwdHintMock.mockResolvedValueOnce('');
    const req = { params: { username: 'sam' } };
    const res = createRes();
    hintUser(req, res);
    await flushPromises();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Unable to fetch password hint');
  });
});
