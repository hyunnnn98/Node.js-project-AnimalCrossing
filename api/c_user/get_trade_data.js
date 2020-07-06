/*
    거래한 내역 정보 반환
*/
// lib
const sequelize = require("sequelize");
const Op = sequelize.Op;

// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Board = models.Board;
const Chat = models.Chat;
const Room = models.Room;

let get_trade_data = async (req, res) => {
    let {us_id, bo_trade_value} = req.query;
    if(bo_trade_value == 1) {
        let board = await Board.findAll({
            where: {bo_us_id: us_id, bo_trade_value}
        })

        response(res, 200, true, "[완료]거래했던 내역 반환", board);
    } else if(bo_trade_value == 2) {
        get_data(res, us_id)
    } else {
        get_data(res, us_id, 3)
    }
}

let get_data = async (res, us_id, bo_trade_value) => {
        let chat = await Chat.findAll({
            where: {
                [Op.or]: [{ch_send_us_id: us_id}, {ch_receive_us_id: us_id}]
            },
            include: [
                {
                    model: Room,
                    attributes: ['ro_us_id', 'ro_bo_id']
                },
            ],
        })
        // console.log("chat", chat);
        let bo_id = [];

        for(let i = 0; i < chat.length; i++) {
            if(chat[i].room.ro_us_id == us_id) {
                bo_id.push(chat[i].room.ro_bo_id);
            }
        }
        
        bo_id = bo_id.filter( (item, idx, array) => {
        	return array.indexOf( item ) === idx ;
        });
        
        // console.log("bo_id", bo_id);
        
        let result = [];
        
        for(let i = 0; i < bo_id.length; i++) {
            let board;
            if(bo_trade_value == 3) {
                board = await Board.findOne({
                    raw: true,
                    where: {bo_id: bo_id[i], bo_trade_value}
                })
            } else {
                board = await Board.findOne({
                    raw: true,
                    where: {bo_id: bo_id[i]}
                })          
            }
            let room = Room.findOne({
                where: {ro_bo_id: bo_id[i], ro_us_id: us_id, ro_trade_status: 5}
            })
            if(room) {
                result.push(board);
            }
        }
        // console.log("result: ", result);
        
        if(result[1] == null) {
            result = [];
        }
        response(res, 200, true, "[완료]거래했던 내역 반환", result);
}

module.exports = get_trade_data;