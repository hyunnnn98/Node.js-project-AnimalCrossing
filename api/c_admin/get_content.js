// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Report = models.Report;

let get_content = async (req, res) => {
    let re_id = req.query.re_id;
    
    let report = await Report.findOne({
        where: {re_id}
    })
    .catch((error) => {
        response(res, 500, false, '[오류] 문의 글을 가져올 수 없습니다.');
    })
    
    res.send(report);
}

module.exports = get_content;