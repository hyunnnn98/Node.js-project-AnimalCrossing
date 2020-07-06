// lib
const sequelize = require("sequelize");
const Op = sequelize.Op;

// modules
const response = require("../../utils/u_res");
const chat_ctrl = require("../c_chat");

// models
const models = require("../../models");
const Review = models.Review;
const Board = models.Board;
const Room = models.Room;

let create = async (req, res) => {
    let {us_id, ro_id, rv_content, rv_rate} = req.body;

    let ro_data = await Room.findOne({
        where: {ro_id}
    })
    .catch((error) => {
        response(res, 500, false, "[에러] 후기 작성에 실패했습니다", error)
    })
    
    let bo_id = ro_data.ro_bo_id;
    let rv_us_id = await chat_ctrl.get_us_id(us_id, ro_id);
    
    await Room.update({
        ro_trade_status: 5
    }, {
        where: {ro_id}
    })
    .catch((error) => {
        response(res, 500, false, "[에러] 후기 작성에 실패했습니다", error)
    })    
    
    await Review.create({
        rv_us_id,
        rv_write_us_id: us_id,
        rv_bo_id: bo_id,
        rv_content,
        rv_rate
    })
    .then((result) => {
        response(res, 200, true, "[완료] 후기 작성을 완료했습니다", result)
    })
    .catch((error) => {
        response(res, 500, false, "[에러] 후기 작성에 실패했습니다", error)
    })
    
}

module.exports = create;

