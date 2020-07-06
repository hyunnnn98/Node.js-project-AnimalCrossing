// modules
const response = require("../../utils/u_res");

// models
const Board = require("../../models").Board;

let create = (req, res) => {
    console.log(req.body);
    const { bo_us_id, bo_title, bo_content, bo_trade_value, bo_category, bo_cost, bo_cost_selector, bo_thumbnail } = req.body;

    try{
        Board.create({
            bo_us_id,
            bo_title,
            bo_content,
            bo_category: parseInt(bo_category),
            bo_trade_value: parseInt(bo_trade_value),
            bo_thumbnail,
            bo_cost: parseInt(bo_cost),
            bo_cost_selector: parseInt(bo_cost_selector)
        })
        .then((Board) => {
            response(res, 200, true, "[완료]게시글 입력 완료", Board.bo_id);
        })
        .catch((error) => {
            response(res, 500, false, "[에러]서버문제로 게시글 입력 실패", error);
        })
    }catch(error){
        response(res, 500, false, "[에러]서버문제로 게시글 입력 실패", error);
    }
}

module.exports = create;