const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

router.get('/', async function (req, res, next) {
  // locally
  // const pictures = fs.readdirSync(path.join(__dirname, '../pictures/'));
  const params = {
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    Delimiter: '/',
    Prefix: 'public/',
  };
  const allObjects = await s3.listObjects(params).promise();
  const keys = allObjects?.Contents.map((x) => x.key);
  const pictures = await Promise.all(
    keys.map(async (key) => {
      let my_file = await s3
        .getObject({
          Bucket: process.env.CYCLIC_BUCKET_NAME,
          key: key,
        })
        .promise();
      return {
        src: Buffer.from(my_file.Body).toString('base64'),
        name: key.split('/').pop(),
      };
    })
  );
  res.render('pictures', { pictures: pictures });
});

router.get('/:pictureName', function (req, res, next) {
  res.render('pictureDetails', { picture: req.params.pictureName });
});

router.post('/', async function (req, res, next) {
  const file = req.files.file;
  // save locally
  // fs.writeFileSync(path.join(__dirname, '../pictures/', file.name), file.data);
  await s3.putObject({
    Body: file.data,
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    key: 'public/' + file.name,
  });
  res.end();
});

module.exports = router;
