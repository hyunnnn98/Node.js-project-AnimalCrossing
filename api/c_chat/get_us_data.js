/* 
    대화 상대방 id 반환
*/

// models
const models = require("../../models");
const User= models.User;

let get_us_id = async (us_id) => {
    let user = await User.findOne({
        where: {
            us_id
        }
    })
    return user;
}

module.exports = get_us_id;