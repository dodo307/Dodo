import './loadEnv.js';
import connectMongo from '../express-backend/dbConnection';
import { expect, jest, test } from '@jest/globals';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

test('Mongo connection test', () => {
  expect(() => connectMongo().not.toThrow('Invalid division by zero'));
});
