const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('pictures');
});

router.post('/', function (req, res, next) {
  const file = req.files.file;
  fs.writeFileSync(path.join(__dirname, '../pictures/', file.name), file.data);
  res.end();
});

module.exports = router;