// lib
const sequelize = require("sequelize");
const Op = sequelize.Op;

// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Board = models.Board;
const Category = models.Category;

// 카테고리 
let search = async (req, res) => {
    let text = req.query.text;
    // console.log(text);
    
    let board = await Board.findAll({
        limit: 10,
        where: {
            [Op.or]: {
                bo_title: {
                    [Op.like]: "%" + text + "%"
                },
                bo_content: {
                    [Op.like]: "%" + text + "%"
                },
            },
            bo_show: 0
        },
        order: [['bo_view', 'DESC']],
        include: [{
            model: Category
        }],
        attributes: ['bo_id', 'bo_title']
    })
    
    response(res, 200 ,true, "[완료] 검색데이터 반환", board);
}

module.exports = search;

