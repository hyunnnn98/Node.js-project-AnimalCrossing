/* 
    메세지 데이터베이스 생성
*/

// models
const models = require("../../models");
const Blacklist= models.Blacklist;

let reject_overlap_blacklist = async (bl_attacker_us_id, bl_victim_us_id) => {
    let blacklist = await Blacklist.findAll({
        where: {bl_victim_us_id, bl_attacker_us_id}
    })
    return blacklist;
}

module.exports = reject_overlap_blacklist;