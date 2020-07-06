// lib
const sequelize = require("sequelize");
const Op = sequelize.Op;

// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Board = models.Board;
const User = models.User;
const Category = models.Category;

let home = async (req, res) => {
    let {offset, ca_id, bo_trade_value} = req.body;
    let check = false;
    let next_offset;
    if(!bo_trade_value) {
        bo_trade_value = 0;
    }
    // console.log("offset: ", offset, " / ca_id: ", ca_id);
    if(offset == -1) {
        offset = await Board.findAll({
            limit: 1,
            where: {
                bo_show: 0
            },
            raw: true,
            order: [ [ 'createdAt', 'DESC' ]]
        })
        .catch((error) => {
            response(res, 409, false, "[에러]게시물이 존재하지 않습니다", error);
        })
        offset = offset[0].bo_id
        check = true;
    }
    
    let board;
    if(ca_id) {
        if(bo_trade_value) {
            board = await Board.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['us_id', 'us_nickname', 'us_grant']
                    },
                    {
                        model: Category,
                    }
                ],
                where: { bo_show: 0 , bo_id: {[Op.lte]: offset}, bo_category: ca_id, bo_trade_value },
                order: [ [ 'createdAt', 'DESC' ]],
                limit: 13
            })
            .catch((error) => {
                response(res, 500, false, "[에러]홈페이지 게시물을 받아올 수 없습니다", error);
            });
        } else {
            board = await Board.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['us_id', 'us_nickname', 'us_grant']
                    },
                    {
                        model: Category,
                    }
                ],
                where: { bo_show: 0 , bo_id: {[Op.lte]: offset}, bo_category: ca_id },
                order: [ [ 'createdAt', 'DESC' ]],
                limit: 13
            })
            .catch((error) => {
                response(res, 500, false, "[에러]홈페이지 게시물을 받아올 수 없습니다", error);
            });
        }
    } else {
        if(bo_trade_value) {
            board = await Board.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['us_id', 'us_nickname', 'us_grant']
                    },
                    {
                        model: Category,
                    }
                ],
                where: { bo_show: 0 , bo_id: {[Op.lte]: offset}, bo_trade_value },
                order: [ [ 'createdAt', 'DESC' ]],
                limit: 13
            })
            .catch((error) => {
                response(res, 500, false, "[에러]홈페이지 게시물을 받아올 수 없습니다", error);
            });
        } else {
            board = await Board.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['us_id', 'us_nickname', 'us_grant']
                    },
                    {
                        model: Category,
                    }
                ],
                where: { bo_show: 0 , bo_id: {[Op.lte]: offset} },
                order: [ [ 'createdAt', 'DESC' ]],
                limit: 13
            })
            .catch((error) => {
                response(res, 500, false, "[에러]홈페이지 게시물을 받아올 수 없습니다", error);
            });
        }

    }
    // console.log(board);
    // 처음 접근 
    
    // 게시물이 12개 보다 적을 때는 바로 넘김
    if(board.length > 12) {
        next_offset = board[12].bo_id;
        board.splice(12, 1);
    } else if(check) {
        next_offset = null;
    }

    response(res, 200, true, "[완료]홈페이지 게시물 데이터 반환", {next_offset, board});
}

module.exports = home;

