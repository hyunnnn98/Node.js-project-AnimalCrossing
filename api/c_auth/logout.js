// modules
const response = require("../../utils/u_res");

// models
const User = require('../../models').User;

let logout = (req, res) => {
    let us_id = req.body.us_id;
  
    User.update({
        us_logintoken: null
    }, {
        where: { us_id: us_id }
    })
    .then(result => {
        response(res, 200, true, '[완료]로그아웃');
    })
    .catch(error => {
        response(res, 500, false, '[에러]서버문제로 로그아웃 실패', error);
    })
}

module.exports = logout;