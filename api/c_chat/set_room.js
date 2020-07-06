/* 
    갱신
    룸 생성
*/

// models
const models = require("../../models");
const Room = models.Room;

let set_read = async (payload) => {
    let {ro_bo_id, ro_us_id, ro_bo_title} = payload;
    
    let room = await Room.create({
        ro_us_id,
        ro_bo_id,
        ro_bo_title
    })
    
    return room;
}

module.exports = set_read;