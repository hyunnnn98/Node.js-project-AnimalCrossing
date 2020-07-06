// lib
const sequelize = require("sequelize");
const Op = sequelize.Op;

// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Review = models.Review;

var destroy = async (req, res) => {
    let {us_id, bo_id} = req.body;
    
    Review.destroy({
        where: {rv_us_id: us_id, rv_bo_id: bo_id}
    })
    
    response(res, 200, true, "[완료] 후기를 삭제했습니다")
}

module.exports = destroy;

