// modules
const response = require("../../utils/u_res");

// models
const User = require('../../models').User;

var token_check = async (req, res) => {
    // console.log(req.headers.authorization);
    // console.log(req.body.us_id);
  
    let us_id = req.body.us_id;
    // header에 들어가 있는 토큰값 반환
    let us_logintoken = req.headers.authorization;
  
    // 토큰값과 유저 id를 비교해서 유저 정보 반환
    let user = await User.findOne({
        where: { us_id, us_logintoken }
    })
    .catch(error => {
        response(res, 500, false, '[에러]서버문제로 계정 정보 반환 실패', error);
    })
    
    if(!user) {
        // 토큰과 us_id가 일치하는 행이 없을 경우
        response(res, 409, false, '[에러]토큰값과 id가 맞지 않아 계정 정보 반환 실패');
    } else {
        const us_info = {
          us_thumbnail: user.us_thumbnail,
          us_nickname: user.us_nickname,
          us_islandname: user.us_islandname,
          us_code: user.us_code,
          us_id: user.us_id,
          us_grant: user.us_grant
        };
        response(res, 200, true, '[완료]토큰 값 일치', us_info);
    }
}

module.exports = token_check;