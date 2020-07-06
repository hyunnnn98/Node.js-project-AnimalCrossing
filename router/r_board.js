// call controller
const ctrl = require('../api/c_board');

// modules
let s3 = require("../utils/u_s3");

module.exports = (router) => {
  
    // 게시글 작성
    router.post('/bo_create', ctrl.create);
    
    // 게시글 삭제
    router.delete('/bo_destroy', ctrl.destroy);
    
    // 게시글 수정
    router.post('/bo_update', ctrl.update);
    
    // 이미지 업로드
    router.post('/image', s3.upload.array('img'), ctrl.image);
 
    // 게시물 상세 정보 반환
    router.get('/detail', ctrl.detail);
    
    // 조회수 올리기
    router.get('/view', ctrl.view);
    
    // 좋아요 & 싫어요
    router.get('/set_likehate', ctrl.set_likehate);
    
    // 공개 & 비공개
    router.get('/show', ctrl.show);
    
    // 거래 완료 & 거래중
    router.get('/set_bo_trade_status', ctrl.set_bo_trade_status);
    
    return router;
}
