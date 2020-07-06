// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Report = models.Report;

var create = async (req, res) => {
    const {re_bl_id, re_us_id, re_title, re_content, re_category} = req.body;
    
    let report = await Report.create({
        re_bl_id,
        re_us_id,
        re_title,
        re_content,
        re_category
    })
    
    response(res, 200, true, "[완료] 1:1문의 작성을 완료했습니다", report)
}

module.exports = create;

