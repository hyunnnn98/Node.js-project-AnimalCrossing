/* 
    메세지 데이터베이스 생성
*/

// models
const models = require("../../models");
const Chat= models.Chat;
const Request = models.Request;

let send_message = async (payload, exist) => {
    let {ch_ro_id, ch_send_us_id, ch_receive_us_id, ch_content, ch_request} = payload;
    let ch_read = 0;
    if(!exist) {
        ch_read = 1;
    }
    let message = await Chat.create({
        ch_ro_id,
        ch_send_us_id,
        ch_receive_us_id,
        ch_content,
        ch_read,
        ch_request
    });
    
    message = await Chat.findOne({
        where: {ch_id: message.ch_id},
        include: [{
            model: Request,
            attributes: ['rq_content']
        }],
    });
    
    return message;
}

module.exports = send_message;