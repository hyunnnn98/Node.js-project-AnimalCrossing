/* 
    메세지 데이터베이스 생성
*/

// models
const models = require("../../models");
const Room = models.Room;

let set_ro_trade_status = async (ro_id, status) => {
    
    await Room.update({
        ro_trade_status: status
    }, {
        where: {ro_id}
    })
}

module.exports = set_ro_trade_status;