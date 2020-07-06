/* 
    실시간 대화 내용 반환
*/

// models
const models = require("../../models");
const Chat= models.Chat;
const Request = models.Request;

let get_chat = async (ro_id) => {
    let chat = await Chat.findAll({
        where: {
            ch_ro_id: ro_id
        },
        include: [{
            model: Request,
            attributes: ['rq_content']
        }],
        order: [['ch_id']]
    })

    return chat;
}

module.exports = get_chat;