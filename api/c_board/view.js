
// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Board = models.Board;

let view = async (req, res) => {
    let bo_id = req.query.bo_id;
    let board = await Board.findOne({ 
        raw: true,
        where: {bo_id},
    })
    
    await Board.update({
        bo_view: board.bo_view + 1
    }, {
        where: {bo_id}
    })
    
    response(res, 200, true, "[완료] 게시물의 상세정보를 반환합니다");
}

module.exports = view;