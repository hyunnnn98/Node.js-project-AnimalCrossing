// modules
const response = require("../../utils/u_res");
const gmail = require("../../utils/u_gmail");
const random = require("../../utils/u_random");
const hash = require("../../utils/u_hash");

// models
const models = require("../../models")
const User = models.User;
const Blacklist = models.Blacklist;

let register = async (req, res) => {
    const { us_email, us_password, us_nickname, us_islandname, us_island_selector, us_code } = req.body;
    // 블랙리스트에 등록된 유저 확인
    Blacklist.findOne({
        where: {bl_us_email: us_email}
    })
    .then((result) => {
        if(result) {
            response(res, 409, false, '[에러]블랙리스트에 등록된 계정입니다')
        }
    })
  
    let hashed_us_password = await hash.hashing(us_password)
    .catch((error) => {
        console.log('', error);
        response(res, 500, false, '[에러]서버에 문제가 있어 회원 가입에 실패하였습니다', error);
    });

    // 랜덤 엑세스 토큰 생성
    let us_access_token = String(random.number(1000, 9999));
    // 네트워크 에러가 없을시 => 객체 생성 후, 유저 모델에 데이터 담기.
    try {
        let thumbnail_random = String(random.number(1, 5));
        const user = await User.create({
            us_email,
            us_password: hashed_us_password,
            us_nickname,
            us_islandname,
            us_island_selector,
            us_code,
            us_thumbnail: `https://deac-project.s3.ap-northeast-2.amazonaws.com/thumbnail/basic/${thumbnail_random}.png`,
            us_access_token
        });
        // 승인 이메일 전송
        // 엑세스토큰 헤쉬후 이메일로 발송
        let hashed_us_access_token = await hash.hashing(us_access_token)
        .catch((error) => {
            console.log('', error);
            response(res, 500, false, '[에러]서버에 문제가 있어 회원 가입에 실패하였습니다', error);
        });
        
        try {
            let emailParam = {
                toEmail : user.us_email,
                subject  : '인증 메일',
                text : 'https://server.anicro.org/auth/access/' + hashed_us_access_token.replace(/\//g, "slash") + '/' + user.us_id
            };
            gmail.sendGmail(emailParam);
        } catch (error) {
            response(res, 409, false, '[에러]서버에 문제가 있어 인증 메일 전송에 실패하였습니다', error);
        }
        
        response(res, 200, true, '[완료]가입이 정상적으로 완료되었습니다');
    } catch (error) {
        response(res, 409, false, '[에러]사용자 아이디가 이미 존재하여 회원 가입이 실패하였습니다', error);
    }
}

module.exports = register;