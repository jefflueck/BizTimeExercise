const express = require('express');
const slugify = require('slugify');
const ExpressError = require('../expressError');
const db = require('../db');

let router = new express.Router();

router.get('/', async (req, res, next) => {
  try {
    let invoices = await db.query(`SELECT * FROM invoices`);
    res.json({ invoices: invoices.rows });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    let invoice = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
    if (invoice.rows.length === 0) {
      throw new ExpressError(`Invoice with id ${id} not found`, 404);
    }
    res.json({ invoice: invoice.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let { comp_code, amt } = req.body;
    let results = await db.query(
      `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`,
      [comp_code, amt]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Company with code ${code} not found`, 404);
    }
    res.json({ invoice: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    let { amt, paid } = req.body;
    let newDate = new Date();
    let results = await db.query(
      `UPDATE invoices SET amt = $1, paid = $2 WHERE id = $3 RETURNING *`,
      [amt, paid, id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Invoice with id ${id} not found`, 404);
    }
    if (paid === true) {
      let paid_date = newDate;
      await db.query(`UPDATE invoices SET paid_date = $1 WHERE id = $2`, [
        paid_date,
        id,
      ]);
    }
    res.json({ invoice: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    let results = await db.query(
      `DELETE FROM invoices WHERE id = $1 RETURNING *`,
      [id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Invoice with id ${id} not found`, 404);
    }
    res.json({ status: `Invoice deleted: ${id}}` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
