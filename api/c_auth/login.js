// modules
const response = require("../../utils/u_res");
const token = require("../../utils/u_token");
const hash = require("../../utils/u_hash");

// models
const models = require("../../models");
const User = models.User;

let login = async (req, res) => {
    let {us_email, us_password, us_fcmtoken} = req.body;
    
    // 아이디로 검색
    let user = await User.findOne({ 
        where: {us_email} 
    })

    // 등록된 유저가 아니면 401 오류 반환
    if (!user) {
        response(res, 401, false, '[에러]등록된 유저가 아닙니다');
    }
    // 등록된 유저인거 식별되면 bcrypt로 해쉬암호화 된 패스워드 검사 후 콜백 내려주기.
    let compare_result = await hash.compare(us_password, user.us_password);
    
    if (compare_result) {
        // 이메일 승인된 계정인지 확인
        if(user.us_access === 0){
            // 승인되지 않은 계정일 경우
            console.log("test");
            response(res, 409, false, '[에러]이메일 인증을 먼저해 주세요');
        } else {
            // 새로운 토큰 발행하기
            const new_token = token(user);
            // 로그인 유저 정보 담기
            const us_info = {
                us_id: user.us_id,
                us_thumbnail: user.us_thumbnail,
                us_nickname: user.us_nickname,
                us_islandname: user.us_islandname,
                us_code: user.us_code,
                us_grant: user.us_grant
            };
            
            // user가 웹으로 접근시 토큰을 유지 시켜줌
            if(!us_fcmtoken) {
                us_fcmtoken = user.us_fcmtoken;
            } else {
                // 만일 fmc토큰 값이 같은 것이 존재하는 경우 삭제한다
                User.update({
                    us_fcmtoken: null
                }, {
                    where: {us_fcmtoken}
                })
            }
                User.update({
                us_logintoken: new_token,
                us_fcmtoken
            }, {
                where: {us_email: user.us_email}
             });
            // 로그인 유저 담은거 최종 JSON 파싱해서 보내주기
            response(res, 200, true, '[완료]로그인 성공', {us_info, new_token});
        }
    } else {
        // 아이디는 맞는데 비밀번호가 틀린 경우
        response(res, 401, false, '[에러]비밀번호가 틀렸습니다');
    }
};

module.exports = login;