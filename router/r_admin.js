// call controller
const ctrl = require('../api/c_admin');

module.exports = (router) => {

    router.get('/', ctrl.get_data);
    
    router.post('/resolve', ctrl.resolve);
    
    router.get('/content', ctrl.get_content);
    
    router.post('/set_notice', ctrl.set_notice);
    
    return router;
};
