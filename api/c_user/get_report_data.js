// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Report = models.Report;
const Answer = models.Answer;

let get_report_data = async (req, res) => {
    let {us_id} = req.query;
    let report = await Report.findAll({
        raw: true,
        where: {re_us_id: us_id}
    })
    .catch((error) => {
        response(res, 409, false, "[에러] 서버 문제로 1:1 문의 데이터를 반환할 수 없습니다", error)
    })
    // console.log(report);
    for(let i = 0; i < report.length; i++) {
        let answer = await Answer.findOne({
            raw: true,
            where: {an_re_id: report[i].re_id}
        })
        report[i].answer = answer;
    }
    
    response(res, 200, true, "[완료] 1:1문의 내역 반환", report)
}

module.exports = get_report_data;

