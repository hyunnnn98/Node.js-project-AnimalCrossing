// call controller
const ctrl = require('../api/c_home');

module.exports = (router) => {
    
    // 게시글 정보 반환
    router.post('/', ctrl.home);
    
    // 카테고리 정보 반환
    router.post('/get_category', ctrl.category);
    
    // 검색된 정보 반환
    router.get('/search', ctrl.search);
    
    return router;
};

