// call controller
const ctrl = require('../api/c_auth');

module.exports = (router) => {
    
    // 로그인
    router.post('/login', ctrl.login);
    
    // 회원가입
    router.post('/register', ctrl.register);
    
    // 이메일 인증
    router.get('/access/:hashed_access_token/:us_id', ctrl.email_access);
    
    // 로그아웃
    router.post('/logout', ctrl.logout);
    
    // 토큰 비교
    router.post('/token_check', ctrl.token_check);

    // 임시 비밀번호 발행
    router.get('/set_temp_password', ctrl.set_temp_password);
    
    router.post('/update_password', ctrl.update_password);
    
    return router;
};
