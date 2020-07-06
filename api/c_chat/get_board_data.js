/* 
    채팅 룸으로 게시물 정보 반환
*/

// models
const models = require("../../models");
const Board= models.Board;

let get_board_data = async (bo_id) => {
    let board = Board.findOne({
        where:{bo_id},
        raw:true
    })
    return board;
}

module.exports = get_board_data;