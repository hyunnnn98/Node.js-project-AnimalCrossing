/*

*/

// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const User = models.User;

let change_code = async (req, res) => {
    let {us_id, us_code} = req.body;
    User.update({
        us_code
    }, {
        where: {us_id}
    })
    .then((result) => {
        response(res, 200, true, "[완료] 통신코드 변경");
    })
    .catch((error) => {
        response(res, 500, false, "[에러] 통신코드 변경 실패");
    })
}

module.exports = change_code;