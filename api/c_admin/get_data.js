// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Report = models.Report;

let get_data = async (req, res) => {
    let report = await Report.findAll({
        order: [
            ['re_id', 'DESC']
        ],
    })
    .catch((error) => {
        response(res, 500, false, '[오류] 1:1문의를 받아올 수 없습니다.');
    })
    
    res.send(report);
}

module.exports = get_data;