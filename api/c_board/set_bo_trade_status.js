
// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Board = models.Board;

let set_bo_trade_status = async (req, res) => {
    let {bo_id, bo_trade_status} = req.query;
    bo_trade_status == 0?bo_trade_status = 1:bo_trade_status = 0;
    
    await Board.update({
        bo_trade_status
    }, {
        where: {bo_id}
    })
    .then((result) => {
        response(res, 200, true, "[완료] 거래완료 & 거래중 설정을 완료했습니다");
    })
    .catch((error) => {
        response(res, 500, false, "[에러] 거래완료 & 거래중 설정에 실패했습니다", error);
    })
}

module.exports = set_bo_trade_status;