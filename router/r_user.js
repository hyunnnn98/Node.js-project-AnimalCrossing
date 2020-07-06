// call controller
const ctrl = require('../api/c_user');
// modules
let s3 = require("../utils/u_change_thumbnail");

module.exports = (router) => {
    
    // 게시글 정보 반환
    router.post('/re_create', ctrl.re_create);
    
    // 1:1 문의 내역
    router.get('/get_report_data', ctrl.get_report_data);
    
    // 1:1 신고당한 내역
    router.get('/get_blacklist_data', ctrl.get_blacklist_data);
    
    // 썸네일 변경
    router.post('/change_thumbnail', s3.upload.array('img'), ctrl.change_thumbnail);
    
    // 통신코드 변경
    router.post('/change_code', ctrl.change_code);
    
    // 거래 내역 정보 반환
    router.get('/get_trade_data', ctrl.get_trade_data);
    
    // 공지 정보 반환
    router.get('/get_notice', ctrl.get_notice);
    
    // 탈퇴하기
    router.post('/delete_user', ctrl.delete_user);
    
    // 탈퇴하기 전에 이메일 확인
    router.post('/delete_email_check', ctrl.delete_email_check);
    
    return router;
};

