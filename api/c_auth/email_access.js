/*

*/

// libs
const bcrypt = require("bcrypt");

// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const User = models.User;

let email_access = async (req, res) => {
    let hashed_access_token = req.params.hashed_access_token;
    let us_id = req.params.us_id;
  
    let user = await User.findOne({ 
        where: { us_id: us_id } 
    })

    let check = await bcrypt.compare(user.us_access_token, hashed_access_token.replace(/slash/g, "/"));
    
    if(check){
        User.update({
            us_access: 1
        }, {
            where: { us_id: us_id }
        });
        response(res, 200, true, '[완료]이메일 인증에 성공했습니다');
    } else {
        response(res, 409, false, '[에러]잘못된 접근입니다');
    }
}

module.exports = email_access;