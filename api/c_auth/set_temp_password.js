/*
    임시 비밀번호 발행
*/
// lib

// modules
const response = require("../../utils/u_res");
const random = require("../../utils/u_random");
const gmail = require("../../utils/u_gmail");
const hash = require("../../utils/u_hash");

// models
const models = require("../../models");
const User = models.User;

let set_temp_password = async (req, res) => {
    let {us_email} = req.query;
    
    let user = await User.findOne({
        where: {us_email}
    })
    
    if(!user) {
        response(res, 409, false, "[에러]존재하지 않는 이메일 입니다");
        return;
    }
    
    let random_string = await random.string(8);
    
    let hashed_random_number = await hash.hashing(random_string);
    
    let emailParam = {
        toEmail : us_email,
        subject  : '변경된 메일',
        text : '임시 비밀번호 발행\n' + random_string
    };
    gmail.sendGmail(emailParam);
    
    let temp_password = hashed_random_number;
    User.update({
        us_password: temp_password
    }, {
        where: {us_id: user.us_id}
    })
        
    response(res, 200, true, "[완료]임시 비밀번호 발행");

}

module.exports = set_temp_password;