// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Report = models.Report;
const Blacklist = models.Blacklist;
const User = models.User;
const Board = models.Board;
const Answer = models.Answer;

let resolve = async (req, res) => {
    const {re_id, content, resolve} = req.body.payload;
    if(resolve) {
        let report = await Report.findOne({
            raw: true,
            where: {re_id}
        })
        .catch((error) => {
            response(res, 500, false, '[오류] 1:1문의를 받아올 수 없습니다.');
        });
        
        let blacklist = await Blacklist.findOne({
            raw: true,
            where: {bl_id: report.re_bl_id}
        })
        .catch((error) => {
            response(res, 500, false, '[오류] 1:1문의를 받아올 수 없습니다.');
        });
        
        let us_id = blacklist.bl_victim_us_id;
        let us_grant = blacklist.bl_us_grant;
        
        User.update({
            us_grant: us_grant
        }, {
            where: {us_id}
        })
        .catch((error) => {
            response(res, 500, false, '[오류] 1:1문의를 받아올 수 없습니다.');
        });
        
        Board.update({
            bo_show: 0
        }, {
            where: {bo_us_id: us_id}
        })
        .catch((error) => {
            response(res, 500, false, '[오류] 1:1문의를 받아올 수 없습니다.');
        });
        
    }
    
    Report.update({
        re_status: 1
    }, {
        where: {re_id}
    })
    .catch((error) => {
        response(res, 500, false, '[오류] 1:1문의를 받아올 수 없습니다.');
    });
        
    Answer.create({
        an_re_id: re_id,
        an_content: content
    })
    
}

module.exports = resolve;