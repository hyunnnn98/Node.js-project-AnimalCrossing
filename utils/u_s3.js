// lib
const AWS = require('aws-sdk');
const multer = require('multer');
const s3_storage = require('multer-sharp-s3');

// config
const aws_crediential = require("../config/aws");

const s3 = new AWS.S3(aws_crediential);

let params = {
    Bucket: 'deac-project',
    ACL: 'public-read-write'
};

global.i = 0;
const storage = s3_storage({
    Key: (req, file, cb) => {
        let bo_id = req.headers.bo_id;
        let type = file.mimetype;
        type = type.split('/')[1];
        if(!type) {
            type = file.mimetype;
        }
        cb(null, `images/${bo_id}/${global.i}-${Date.now()}.${type}`);
        global.i ++;
    },
    s3,
    Bucket: params.Bucket,
    resize: {
        width: 500
    },
    max: true,
    acl: 'public-read-write',
    contentDisposition: 'attachment',
    serverSideEncryption: 'AES256'
});

exports.upload = multer({ storage: storage });
