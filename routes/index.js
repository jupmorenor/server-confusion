const express = require('express');
const router = express.Router();
const cors = require('./cors');

/* GET home page. */
router.get('/', cors.cors, (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
