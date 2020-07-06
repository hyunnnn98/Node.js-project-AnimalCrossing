/* 
    룸 데이터 반환
*/

// models
const models = require("../../models");
const Room = models.Room;

let get_ro_id = async (ro_id) => {
    let room = await Room.findOne({
        raw: true,
        where: {
            ro_id
        }
    })
    return room;
}

module.exports = get_ro_id;