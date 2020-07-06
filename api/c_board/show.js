
// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Board = models.Board;

let show = async (req, res) => {
    let {bo_id, bo_show} = req.query;
    
    bo_show == 0?bo_show = 1:bo_show = 0;

    await Board.update({
        bo_show
    }, {
        where: {bo_id}
    })
    .then((result) => {
        response(res, 200, true, "[완료] 공개 & 비공개 설정을 완료했습니다");
    })
    .catch((error) => {
        response(res, 500, false, "[에러] 공개 & 비공개 설정에 실패했습니다", error);
    })
}

module.exports = show;