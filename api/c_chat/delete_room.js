/* 
    채팅 룸으로 게시물 정보 반환
*/

// models
const models = require("../../models");
const Room = models.Room;
const Chat = models.Chat;

let delete_room = async (us_id, ro_id) => {
    let check;
    let room = await Room.findOne({
        where: {ro_id}
    })
    
    if(room.ro_exit) {
        Chat.destroy({
            where: {ch_ro_id: ro_id}
        })
        Room.destroy({
            where: {ro_id}
        }) 
        check = 1;
    } else {
        Room.update({
            ro_exit: us_id
        }, {
            where: {ro_id}
        })
        check = 0;
    }
    
    return check;
}

module.exports = delete_room;