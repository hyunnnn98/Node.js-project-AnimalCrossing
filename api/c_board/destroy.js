// modules
const response = require("../../utils/u_res");
const delete_s3_folder = require("../../utils/u_s3_delete");

// models
const models = require("../../models");
const Board = models.Board;
const Image = models.Image;
const Likehate = models.Likehate;
const Review = models.Review;

let destroy = async (req, res) => {
    const {us_id, bo_id} = req.query;

    Likehate.destroy({
        where: {lh_bo_id: bo_id}
    })
    .catch((error) => {
        response(res, 500, false, "[에러]좋아요 싫어요를 삭제하던 도중 오류가 발생했습니다", error);
    }) 
    
    Review.destroy({
        where: {rv_bo_id: bo_id}
    })
    .catch((error) => {
        response(res, 500, false, "[에러]리뷰를 삭제하던 도중 오류가 발생했습니다", error);
    }) 
    
    let image = await Image.findAll({
        where: {im_bo_id: bo_id}    
    })

    if(image.length) {
        delete_s3_folder("deac-project", bo_id);
    }
    
    Image.destroy({
        where: {im_bo_id: bo_id}
    })
    .catch((error) => {
        response(res, 500, false, "[에러]이미지를 삭제하던 도중 오류가 발생했습니다", error);
    })
    
    Board.destroy({
        where: {bo_id, bo_us_id: us_id}
    })
    .then((result) => {
        response(res, 200, true, "[완료]게시글을 삭제했습니다");
    })
    .catch((error) => {
        response(res, 500, false, "[에러]게시글을 삭제하지 못했습니다", error);
    })
}

module.exports = destroy;