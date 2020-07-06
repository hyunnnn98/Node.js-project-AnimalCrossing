/* 
    신고하기
*/

// models
const models = require("../../models");
const User = models.User;
const Blacklist = models.Blacklist;
const Board = models.Board;

let set_blacklist = async (payload) => {
    let {bl_bo_id, bl_attacker_us_id, bl_victim_us_id, bl_content} = payload;
    let bl_us_email = await User.findOne({
        raw: true,
        where: {us_id: bl_victim_us_id}
    })
    
    bl_us_email = bl_us_email.us_email;
    
    let us_grant = await User.findOne({
        raw: true,
        where: {us_id: bl_victim_us_id}
    })
    us_grant = us_grant.us_grant;
    
    User.update({
        us_grant: -1
    }, {
        where: {us_id: bl_victim_us_id}
    })
    
    Board.update({
        bo_show: 1    
    }, {
        where: {bo_us_id: bl_victim_us_id}
    })
    
    Blacklist.create({
        bl_bo_id,
        bl_victim_us_id,
        bl_attacker_us_id,
        bl_us_email,
        bl_content,
        bl_us_grant: us_grant
    })
}

module.exports = set_blacklist;