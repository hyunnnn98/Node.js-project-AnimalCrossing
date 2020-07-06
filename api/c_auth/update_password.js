/*
    비밀번호 변경
*/
// lib

// modules
const response = require("../../utils/u_res");
const hash = require("../../utils/u_hash");

// models
const models = require("../../models");
const User = models.User;

let update_password = async (req, res) => {
    let {us_id, us_password, _us_password} = req.body;
    console.log(req.body);
    
    let user = await User.findOne({
        raw: true,
        where: {us_id}
    })
    .catch((error) => {
        response(res, 500, false, "[에러] 서버문제로 비밀번호를 변경할 수 없습니다", error);
    })
    
    let check = await hash.compare(us_password, user.us_password);

    if(!check) {
        response(res, 409, false, "[에러] 비밀번호가 일치하지 않습니다");
        return;
    }
    
    let hashed_us_password = await hash.hashing(_us_password);
    
    User.update({
        us_password: hashed_us_password
    }, {
        where: {us_id}
    })
    .catch((error) => {
        response(res, 500, false, "[에러] 서버문제로 비밀번호를 변경할 수 없습니다", error);
    })
    
    response(res, 200, true, "[완료] 비밀번호를 변경하였습니다");
}

module.exports = update_password;