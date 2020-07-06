// lib
const sequelize = require("sequelize");
const Op = sequelize.Op;

// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Review = models.Review;
const User = models.User;

var get_data = async (req, res) => {
    let {us_id} = req.query;

    Review.findAll({
        where: {rv_us_id: us_id},
        attributes: ['rv_content', 'rv_rate', 'createdAt'],
        include: [{
            model: User,
            attributes: ['us_nickname', 'us_thumbnail'],
        }],
        order: [ [ 'createdAt', 'DESC' ]],
    })
    .then((result) => {
        response(res, 200, true, "[완료] 후기 데이터 반환 성공", result);
    })
    .catch((error) => {
        response(res, 500, false, "[에러] 후기 데이터를 받을 수 없음", error);
    })
}

module.exports = get_data;

