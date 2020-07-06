/*

*/

// lib
const sequelize = require("sequelize");
const Op = sequelize.Op;
const AWS = require('aws-sdk');

// modules
const response = require("../../utils/u_res");
const delete_s3_folder = require("../../utils/u_s3_delete");

// models
const models = require("../../models");
const User = models.User;
const Review = models.Review;
const Likehate = models.Likehate;
const Board = models.Board;
const Image = models.Image;
const Report = models.Report;

// config
const aws_crediential = require("../../config/aws");

let delete_user = async (req, res) => {
    /* 
        1. review -> 삭제
        2. likehate -> 이 사람이 좋아요, 싫어요 누른 board 다시 계산
        3. chat 처리 끝
        4. board -> image
        5. report
        6. user 삭제
    */
    let {us_id} = req.body;
    console.log(us_id);
    
    // 좋아요 삭제
    await remove_likehate(us_id);

    // 리뷰 삭제
    await Review.destroy({
        where: {
            [Op.or]: [{rv_us_id: us_id}, {rv_write_us_id: us_id}]
        }
    })
    
    // 1:1 문의 삭제
    await Report.destroy({
        where: {re_us_id: us_id}
    })
    
    // 게시판 삭제
    await remove_board(us_id);
    
    
    // 유저 정보 삭제
    let s3 = new AWS.S3(aws_crediential);
    let user = await User.findOne({
        where: {us_id}
    })
    let us_thumbnail = user.us_thumbnail.split("/").reverse()[0];
    let params = {  Bucket: 'deac-project', Key: `thumbnail/${us_thumbnail}` };
            
    await s3.deleteObject(params, function(err, data) {
        if (err)  console.log(err, err.stack);
         else  console.log();
    });
    User.destroy({
        where: {
            us_id
        }
    })
    
    response(res, 200, true, "[완료] 회원탈퇴가 완료되었습니다.");
}

module.exports = delete_user;

let remove_likehate = async (us_id) => {
    
    let likehate = await Likehate.findAll({
        where: {lh_us_id: us_id}
    })
    
    for(let i = 0; i < likehate.length; i++) {
        let board = await Board.findOne({
            where: {bo_id: likehate[i].lh_bo_id}
        })
        if(likehate[i].lh_either == 0) {
            Board.update({
                bo_like: board.bo_like -1
            }, {
                where: {bo_id: board.bo_id}
            })
        } else {
            Board.update({
                bo_hate: board.bo_hate -1
            }, {
                where: {bo_id: board.bo_id}
            })
        }
    }
    
    Likehate.destroy({
        where: {lh_us_id: us_id}
    })
}

let remove_board = async (us_id) => {
    let board = await Board.findAll({
        raw: true,
        where: {bo_us_id: us_id}
    })
    if(board.length > 0) {
        for(let i = 0; i < board.length; i ++) {
            let bo_id = board[i].bo_id;
        
            await Likehate.destroy({
                where: {lh_bo_id: bo_id}
            })
        
            await Review.destroy({
                where: {rv_bo_id: bo_id}
            })
            
            let image = await Image.findAll({
                where: {im_bo_id: bo_id}    
            })
        
            if(image.length) {
                delete_s3_folder("deac-project", bo_id);
            }
            
            await Image.destroy({
                where: {im_bo_id: bo_id}
            })
        
            Board.destroy({
                where: {bo_id}
            })
        }
    }
}