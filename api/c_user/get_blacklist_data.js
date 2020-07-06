// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Blacklist = models.Blacklist;
const Board = models.Board;

let get_blacklist_data = async (req, res) => {
    let {us_id} = req.query;
    
    let blacklist = await Blacklist.findAll({
        raw: true,
        where: {bl_victim_us_id: us_id}
    })
    .catch((error) => {
        response(res, 409, false, "[에러] 서버 문제로 신고 데이터를 반환할 수 없습니다", error)
    })

    for(let i = 0; i < blacklist.length; i++) {
        let board = await Board.findOne({
            raw: true,
            where: {bo_id: blacklist[i].bl_bo_id}
        })
        blacklist[i].bl_bo_title = board.bo_title
    }
    
    response(res, 200, true, "[완료] 신고 당한 내역 반환", blacklist)
}

module.exports = get_blacklist_data;

