// lib
const AWS = require('aws-sdk');
const multer = require('multer');
const s3Storage = require('multer-sharp-s3');

// config
const aws_crediential = require("../config/aws");

const s3 = new AWS.S3(aws_crediential);

// models
const models = require("../models");
const User = models.User;

let params = {
    
    Bucket: 'deac-project',
    ACL: 'public-read-write'
};
const storage =  s3Storage({
    Key: async (req, file, cb) => {
        
        let us_id = req.headers.us_id;
        let user_data = await User.findOne({
            raw: true,
            where: {us_id}
        })
        let us_thumbnail = user_data.us_thumbnail;
        let _type = us_thumbnail.split('.')[2];
        if(us_thumbnail.indexOf("/basic/") == -1) {
            let s3 = new AWS.S3();
            let params = {  Bucket: 'deac-project', Key: `thumbnail/${us_id}.${_type}` };
            
            await s3.deleteObject(params, function(err, data) {
              if (err)  console.log(err, err.stack);
              else  console.log();
            });
        }
        
        let type = file.mimetype;
        type = type.split('/')[1];
        if(!type) {
            type = file.mimetype;
        }
        cb(null, `thumbnail/${us_id}.${type}`);
    },
    s3,
    Bucket: params.Bucket,
    resize: {
        width: 100
    },
    max: true,
    acl: 'public-read-write',
    contentDisposition: 'attachment',
    serverSideEncryption: 'AES256'
});

exports.upload = multer({ storage: storage });
