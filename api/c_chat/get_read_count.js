/* 
    안 읽은 대화 갯수 반환
*/

// models
const models = require("../../models");
const Chat= models.Chat;

let get_read_count = async (us_id) => {
    let chat = await Chat.findAll({
        raw: true,
        where: {
            ch_receive_us_id: us_id
        }
    })
    .catch((error) => {
        chat = [];
    })
    
    let count = 0;
    for(let i = 0; i < chat.length; i++) {
        count = count + chat[i].ch_read;   
    }

    return count;
}

module.exports = get_read_count;