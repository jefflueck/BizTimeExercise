process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
beforeEach(async () => {
  const result = await db.query(
    `INSERT INTO companies (code, name, description) VALUES ('ABC', 'ABC Company', 'ABC description') RETURNING *`
  );
  testCompany = result.rows[0];
});

afterEach(async () => {
  await db.query('DELETE FROM companies');
});

afterAll(async () => {
  await db.end();
});

describe('It should GET all companies', () => {
  test('It should GET all companies', async () => {
    const response = await supertest(app).get('/companies');
    expect(response.status).toBe(200);
    expect(response.body.companies).toHaveLength(1);
  });
});
