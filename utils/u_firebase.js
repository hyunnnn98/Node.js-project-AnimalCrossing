// lib
const admin = require("firebase-admin");
const service_account = require("../config/firebase");
    
// models
const models = require("../models");
const User = models.User;

admin.initializeApp({
    credential: admin.credential.cert(service_account),
    databaseURL: "https://animal-crossing-9e465.firebaseio.com"
});
    
let firebase = async (us_id, notification) => {
    
    let payload = {
        notification
    }
    
    // models에서 토큰값 가져옴.
    let us_fcmtoken = await User.findOne({
        where: {us_id},
        attributes: ['us_fcmtoken']
    });
    us_fcmtoken = us_fcmtoken.dataValues.us_fcmtoken;
    try{
        admin.messaging().sendToDevice(us_fcmtoken, payload)
        .then(function(response) {
            console.log("알림 전송", response);
        })
        .catch((error) => {
            console.log("에러 발생", error);
        })
    }catch(error) {
        console.log("상대방 fcm 토큰 없음")
    }

}

module.exports = firebase;