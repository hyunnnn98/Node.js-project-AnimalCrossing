/*
    좋아요 싫어요 이벤트 처리
*/

// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Board = models.Board;
const Likehate = models.Likehate;

let set_likehate = async (req, res) => {
    let { selected, us_id, bo_id } = req.query;
    
    let likehate = await Likehate.findOne({
        where: {lh_us_id: us_id, lh_bo_id: bo_id}
    })
    
    let board = await Board.findOne({
        where: {bo_id}
    })
    
    let bo_like = board.bo_like;
    let bo_hate = board.bo_hate;
    let data = {
        bo_like,
        bo_hate
    }
    let message;
    let check;
    if(likehate) {
        // 이미 저장된 좋아요 / 싫어요 값이 있을 경우
        if(likehate.lh_either == 0) {
            if(selected == 0) {
                // 이미 좋아요 되어 있을 경우 좋아요 취소
                await Likehate.destroy({
                    where: {lh_us_id: us_id, lh_bo_id: bo_id}
                })
                Board.update({
                    bo_like: bo_like - 1
                }, {
                    where: {bo_id}
                })               
                data.bo_like --;
                message = '좋아요 취소'
                check = null;
            } else {
                // 0이면 좋아요
                await Likehate.destroy({
                    where: {lh_us_id: us_id, lh_bo_id: bo_id}
                })
                Likehate.create({
                    lh_us_id: us_id,
                    lh_bo_id: bo_id,
                    lh_either: 1
                })
                Board.update({
                    bo_like: bo_like - 1,
                    bo_hate: bo_hate + 1
                }, {
                    where: {bo_id}
                })
                data.bo_like --;
                data.bo_hate ++;
                message = '좋아요 -> 싫어요';
                check = "pi-bad-clicked";
            }
        } else {
            // 1이면 싫어요
            if(selected == 1) {
                // 이미 싫어요 되어 있을 경우
                await Likehate.destroy({
                    where: {lh_us_id: us_id, lh_bo_id: bo_id}
                })
                Board.update({
                    bo_hate: bo_hate - 1
                }, {
                    where: {bo_id}
                })                
                data.bo_hate --;
                message = '싫어요 취소';
            } else {
                // 1이면 싫어요
                await Likehate.destroy({
                    where: {lh_us_id: us_id, lh_bo_id: bo_id}
                })
                Likehate.create({
                    lh_us_id: us_id,
                    lh_bo_id: bo_id,
                    lh_either: 0
                })
                Board.update({
                    bo_like: bo_like + 1,
                    bo_hate: bo_hate - 1
                }, {
                    where: {bo_id}
                })
                data.bo_like ++;
                data.bo_hate --;
                message = '싫어요 -> 좋아요';
                check = "pi-like-clicked";
            }            
        }
    } else {
        // 저장된 좋아요 / 싫어요 값이 없을 경우
        if(selected == 0) {
            // 좋아요
            Likehate.create({
                lh_us_id: us_id,
                lh_bo_id: bo_id,
                lh_either: 0
            })
            Board.update({
                bo_like: bo_like + 1
            }, {
                where: {bo_id}
            })
            data.bo_like ++;
            message = '신규 좋아요';
            check = "pi-like-clicked";
        } else {
            // 싫어요
            Likehate.create({
                lh_us_id: us_id,
                lh_bo_id: bo_id,
                lh_either: 1
            })
            Board.update({
                bo_hate: bo_hate + 1
            }, {
                where: {bo_id}
            })
            data.bo_hate ++;
            message = '신규 싫어요';
            check = "pi-bad-clicked";
        }
    }

    
    response(res, 200, true, "[완료]" + message, {data, check});
}
module.exports = set_likehate;