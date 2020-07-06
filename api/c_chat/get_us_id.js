/* 
    대화 상대방 id 반환
*/

// models
const models = require("../../models");
const Chat= models.Chat;
// 23 - 163-24
let get_us_id = async (us_id, ro_id) => {
    
    let chat = await Chat.findAll({
        raw: true,
        limit: 1,
        where: {
            ch_ro_id: ro_id
        }
    })
    let ch_receive_us_id;

    if(chat[0].ch_send_us_id == us_id) {
        ch_receive_us_id = chat[0].ch_receive_us_id;
    } else {
        ch_receive_us_id = chat[0].ch_send_us_id;
    }
    return ch_receive_us_id;
}

module.exports = get_us_id;