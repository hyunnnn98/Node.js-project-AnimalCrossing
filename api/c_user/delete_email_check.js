/*

*/

// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const User = models.User;

let delete_email_check = async (req, res) => {
    let {us_id, us_email} = req.body;
    let user = await User.findOne({
        where: {us_id, us_email}
    })
    
    if(user) {
        response(res, 200, true, "[완료] 이메일 확인 완료.", true);
    } else {
        response(res, 409, false, "[에러] 이메일 존재하지 않음.", false);
    }
}

module.exports = delete_email_check;