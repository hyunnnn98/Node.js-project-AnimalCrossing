// models
const models = require("../models");
const User = models.User;
    
let check_blacklist = async (us_id) => {
    let user = User.findOne({
        where: {us_id}
    })
    if(user.us_grant == -1){
        return false;
    }
    return true;
}

module.exports = check_blacklist;