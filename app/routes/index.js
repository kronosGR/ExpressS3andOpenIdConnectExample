var express = require('express');
const fs = require('fs');
const path = require('path');
var router = express.Router();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

/* GET home page. */
router.get('/', async function (req, res, next) {
  // locally
  // const pictures = fs.readdirSync(path.join(__dirname, '../pictures/'));
  const params = {
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    Delimiter: '/',
    Prefix: 'public/',
  };
  const allObjects = await s3.listObjects(params).promise();
  const keys = allObjects?.Contents.map((x) => x.Key);
  const pictures = await Promise.all(
    keys.map(async (key) => {
      let my_file = await s3
        .getObject({
          Bucket: process.env.CYCLIC_BUCKET_NAME,
          Key: key,
        })
        .promise();
      return {
        src: Buffer.from(my_file.Body).toString('base64'),
        name: key.split('/').pop(),
      };
    })
  );
  res.render('index', {
    pictures: pictures,
    title: 'Express',
    isAuthenticated: req.oidc.isAuthenticated(),
  });
});

module.exports = router;
