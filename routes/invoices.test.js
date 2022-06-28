process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const app = require('../app');
const db = require('../db');

let testInvoice;

beforeEach(async () => {
  const result = await db.query(
    `INSERT INTO invoices (comp_code, amt) VALUES ('ABC', 100) RETURNING *`
  );
  testInvoice = result.rows[0];
});

afterEach(async () => {
  await db.query('DELETE FROM invoices');
});

afterAll(async () => {
  await db.end();
});

describe('It should GET all invoices', () => {
  test('It should GET all invoices', async () => {
    const response = await supertest(app).get('/invoices');
    expect(response.status).toBe(200);
    expect(response.body.invoices).toHaveLength(1);
  });
});
