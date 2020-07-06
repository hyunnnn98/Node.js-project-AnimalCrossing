// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Notice = models.Notice;


let get_notice = async (req, res) => {
    let notice = await Notice.findAll({
        order: [ [ 'createdAt', 'DESC' ]],
    });
    response(res, 200, true, "[완료] 공지 정보 반환", notice);
}

module.exports = get_notice;

