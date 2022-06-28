const express = require('express');
const slugify = require('slugify');
const ExpressError = require('../expressError');
const db = require('../db');

let router = new express.Router();

router.post('/', async (req, res, next) => {
  try {
    let { code, industry } = req.body;
    let newCode = slugify(code, { lower: true });
    let results = await db.query(
      `INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *`,
      [newCode, industry]
    );
    res.json({ industries: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    let industries = await db.query(
      // ? Go over with mentor not sure why my join is not working for the data I want.
      // `SELECT * FROM industries RIGHT JOIN companies ON industries.code = companies.code ORDER BY industry`
      `SELECT * FROM industries`
    );
    res.json({ industries: industries.rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
