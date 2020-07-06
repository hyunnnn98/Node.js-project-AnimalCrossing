// modules
const response = require("../../utils/u_res");
const delete_s3_folder = require("../../utils/u_s3_delete");

// models
const models = require("../../models");
const Board = models.Board;
const Image = models.Image;

let update = async (req, res) => {
    let { bo_id, bo_title, bo_content, bo_trade_value, bo_category, bo_cost, bo_cost_selector, bo_thumbnail } = req.body;
    
    let image = await Image.findAll({
        where: {im_bo_id: bo_id}    
    })
    
    if(image) {
        delete_s3_folder("deac-project", bo_id);
    }
    
    Image.destroy({
        where: {im_bo_id: bo_id}
    })
    .catch((error) => {
        response(res, 500, false, "[에러]이미지를 삭제하던 도중 오류가 발생했습니다", error);
    })
    
    await Board.update({
        bo_title,
        bo_content,
        bo_category: parseInt(bo_category),
        bo_trade_value: parseInt(bo_trade_value),
        bo_thumbnail,
        bo_cost: parseInt(bo_cost),
        bo_cost_selector: parseInt(bo_cost_selector)
    }, {
        where: {bo_id}
    })    
    .then((board) => {
        response(res, 200, true, "[완료]게시글 수정 완료", bo_id);
    })
    .catch((error) => {
        response(res, 500, false, "[에러]서버문제로 게시글 수정 실패", error);
    })
}

module.exports = update;