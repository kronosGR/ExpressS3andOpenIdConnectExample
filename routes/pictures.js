const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res, next) {
  const pictures = fs.readdirSync(path.join(__dirname, '../pictures/'));
  res.render('pictures', { pictures: pictures });
});

router.get('/:pictureName', function (req, res, next) {
  res.render('pictureDetails', { picture: req.params.pictureName });
});

router.post('/', function (req, res, next) {
  const file = req.files.file;
  fs.writeFileSync(path.join(__dirname, '../pictures/', file.name), file.data);
  res.end();
});

module.exports = router;
