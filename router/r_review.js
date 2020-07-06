// call controller
const ctrl = require('../api/c_review');

module.exports = (router) => {
    
    // 후기 작성
    router.post('/rv_create', ctrl.create);
    
    // 후기 삭제
    router.post('/rv_destroy', ctrl.destroy);
    
    router.get('/rv_get_data', ctrl.get_data);
    
    return router;
};

