
// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Board = models.Board;
const User = models.User;
const Review = models.Review;
const Image = models.Image;
const Room = models.Room;
const Likehate = models.Likehate;

let detail = async (req, res) => {
    let {us_id, bo_id} = req.query;
    
    let board = await Board.findOne({ 
        where: {bo_id},
        include: [{
            model: User,
            attributes: ['us_id', 'us_nickname', 'us_islandname', 'us_thumbnail', 'us_grant' ],
            include: [{
                model: Review,
                attributes: ['rv_content', 'rv_rate', 'createdAt'],
                include: [{
                    model: User,
                    attributes: ['us_nickname', 'us_thumbnail'],
                }],
            }],
        }],
    })
    .catch((error) => {
        response(res, 500, false, "[에러] 서버문제로 게시물의 상세내용을 가져오지 못했습니다", error);
    })
    
    // 이미 채팅방이 만들어져 있는지 확인
    let ro_data = await Room.findOne({
        raw: true,
        where: {ro_bo_id: bo_id, ro_us_id: us_id}
    })
    let exist;
    if(ro_data) {
        exist = true    
    } else {
        exist = false
    }
    
    let likehate = await Likehate.findOne({
        where: {lh_us_id: us_id, lh_bo_id: bo_id}
    })
    
    if(!board) {
        response(res, 409, false, "[에러] 게시물 정보가 없습니다");
    } else {
        const image = await Image.findAll({
            raw: true,
            where: {im_bo_id: bo_id}
        })
        board.dataValues.image = image;
        board.dataValues.chat_exist = exist;
        if(exist) board.dataValues.ch_ro_id = ro_data.ro_id;
        if(likehate) {
            if(likehate.lh_either) likehate = "pi-bad-clicked";
            else likehate = "pi-like-clicked";
        }
        board.dataValues.likehate = likehate;
        response(res, 200, true, "[완료] 게시물의 상세정보를 반환합니다", board);
    }
}

module.exports = detail;