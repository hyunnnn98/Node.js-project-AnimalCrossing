/* 
    회원 탈퇴시 접속하고 있는 룸 객체 반환
*/
// lib
const sequelize = require("sequelize");
const Op = sequelize.Op;

// models
const models = require("../../models");
const Chat = models.Chat;

let get_delete_room_list = async (us_id) => {
    let chat = await Chat.findAll({
        raw: true,
        attributes: [
            'ch_ro_id',
            'ch_send_us_id',
            'ch_receive_us_id',
        ],
        where: {
            [Op.or]: [{ch_send_us_id: us_id}, {ch_receive_us_id: us_id}]
        },
        group: ['ch_ro_id']
    })
    
    return chat;
}

module.exports = get_delete_room_list;