const express = require('express');
const slugify = require('slugify');
const ExpressError = require('../expressError');
const db = require('../db');

let router = new express.Router();

router.get('/', async (req, res, next) => {
  try {
    let companies = await db.query(
      `SELECT * FROM companies JOIN industries_companies ON companies.code = industries_companies.code`
    );
    res.json({ companies: companies.rows });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let { name, description } = req.body;
    let code = slugify(name, { lower: true });
    let newCompany = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`,
      [code, name, description]
    );
    res.json({ company: newCompany.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.put('/:code', async (req, res, next) => {
  try {
    let { code } = req.params;
    let { name, description } = req.body;
    let results = await db.query(
      `UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *`,
      [name, description, code]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Company with code ${code} not found`, 404);
    }
    res.json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:code', async (req, res, next) => {
  try {
    let { code } = req.params;
    let results = await db.query(
      `DELETE FROM companies WHERE code = $1 RETURNING *`,
      [code]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Company with code ${code} not found`, 404);
    }
    res.json({ status: `Company deleted: ${code}` });
  } catch (err) {
    return next(err);
  }
});

router.get('/:code', async (req, res, next) => {
  try {
    let { code } = req.params;
    let companyInvoices = await db.query(
      `SELECT * FROM invoices WHERE comp_code = $1`,
      [code]
    );
    if (companyInvoices.rows.length === 0) {
      throw new ExpressError(`Company with code ${code} not found`, 404);
    }
    res.json({ company: { invoices: companyInvoices.rows } });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
