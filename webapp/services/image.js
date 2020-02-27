var multer  = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3 = new aws.S3();
var dotenv = require('dotenv');
const bucket = process.env.S3_BUCKET_ADDR;
aws.config.update({region: 'us-east-1'});
aws.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Region: ", aws.config.region);
    console.log("Access key:", aws.config.credentials.accessKeyId);
    console.log("Secret access key:", aws.config.credentials.secretAccessKey);
  }
});

var upload = multer({
    storage: multerS3({ 
        s3: s3,
        bucket: bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            objId = file.originalname + '_' + Date.now().toString();
            cb(null, objId);
        }
    }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg')
            return cb(null, true);
        else
            return cb(new Error('Unsupported File Format'), false);
    }
});

module.exports = {
  upload
}