/* 
    룸에 접속시 안읽은 내용 읽음으로 처리
*/

// models
const models = require("../../models");
const Chat= models.Chat;

let set_read = async (us_id, ro_id) => {
    await Chat.update({
        ch_read: 0,
    }, {
        where: {ch_ro_id: ro_id, ch_receive_us_id: us_id}
    })
}

module.exports = set_read;