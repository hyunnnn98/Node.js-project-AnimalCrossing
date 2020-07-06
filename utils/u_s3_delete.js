// lib
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config/aws.json');
const s3 = new AWS.S3();

let delete_s3_folder = (bucketName, folder) => {
    var params = {
        Bucket: bucketName,
        Prefix: 'images/' + folder + '/'
    };

    s3.listObjects(params, function(err, data) {
        if (err) console.log(err);
    
        if (!(data.Contents.length == 0)) {
            params = {Bucket: bucketName};
            params.Delete = {Objects:[]};
        
            data.Contents.forEach(function(content) {
                params.Delete.Objects.push({Key: content.Key});
            });
    
            s3.deleteObjects(params, function(err, data) {
                if (err) console.log(err);
                if(data.Contents){
                    if(data.Contents.length == 10)delete_s3_folder(bucketName);
                    else console.log("error");
                }
            });
        }
    });
}

module.exports = delete_s3_folder;