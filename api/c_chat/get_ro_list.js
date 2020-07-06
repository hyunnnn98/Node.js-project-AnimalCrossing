/* 채팅방 들어가기전 대화방 목록과 안읽은 대화 갯 수 반환 */

// lib
const sequelize = require("sequelize");
const Op = sequelize.Op;

// models
const models = require("../../models");
const Chat = models.Chat;
const Board = models.Board;
const User = models.User;
const Room = models.Room;

let get_ro_list = async (us_id) => {
    // chat table에서 보낸 사람 or 받은 사람 중에 사용자 id가 존재한 채팅방 room 이름 반환
    let chat = await Chat.findAll({
        raw: true,
        attributes: [
            'ch_ro_id',
            'ch_send_us_id',
            'ch_receive_us_id',
            [sequelize.fn('MAX', sequelize.col('chat.createdAt')), 'createdAt']
        ],
        where: {
            [Op.or]: [{ch_send_us_id: us_id}, {ch_receive_us_id: us_id}]
        },
        group: ['ch_ro_id']
    })
    .catch((error) => {
        return error;
    })
    
    let read = await Chat.findAll({
        raw: true,
        where:[
            {ch_receive_us_id: us_id, ch_read: 1}
        ],
        attributes: [
            'ch_id',
            'ch_ro_id',
            'ch_read'
        ]
    })
    
    let read_count = [];
    let temp;
    for( let i = 0; i < read.length; i++) {
        if(temp == read[i].ch_ro_id){
            for( let j = 0; j < read_count.length; j++) {
                if(read_count[j].ch_ro_id == read[i].ch_ro_id) {
                    read_count[j].ch_read ++;
                }
            }
        } else {
            let arr = {
                "ch_ro_id": read[i].ch_ro_id,
                "ch_read": 1
            }
            read_count.push(arr);
        }
        temp = read[i].ch_ro_id;
    }
    
    chat = chat.sort(function(a, b) {
        return b['createdAt'] - a['createdAt'];
    });

    
    let count = 0;
    
    for(let i = 0; i < chat.length; i++) {
        let ro_data = await Room.findOne({
            raw: true,
            where: {ro_id: chat[i].ch_ro_id}
        })
        
        // 나간 채팅방인지 확인
        if(ro_data.ro_exit != us_id) {
            
            let content = await Chat.findOne({
                raw: true,
                where: {createdAt: chat[i].createdAt} 
            });
            chat[i].ch_content = content.ch_content;
            
            chat[i].bo_title = ro_data.ro_bo_title;
            
            let bo_id = ro_data.ro_bo_id;
            let board = await Board.findOne({
                where: {bo_id},
                attributes: ['bo_id','bo_title'],
            })
            chat[i].board = board;
            
            let _us_id;
            if(chat[i].ch_send_us_id == us_id){
                _us_id = chat[i].ch_receive_us_id;
            } else {
                _us_id = chat[i].ch_send_us_id;
            }
            
            let user = await User.findOne({
                raw: true,
                where: {us_id: _us_id},
                attributes: ['us_thumbnail','us_nickname'],
            })
            
            chat[i].user = user;
            
            for(let n in read_count) {
                if(chat[i].ch_ro_id === Object.getOwnPropertyNames(read_count[n])[0]) {
                    chat[i].ch_read = read_count[n];
                    count = count + read_count[n];
                }
            }
            for(let j = 0; j < read_count.length; j++) {
                if(chat[i].ch_ro_id === read_count[j].ch_ro_id){
                    chat[i].ch_read = read_count[j].ch_read;
                    count = count + read_count[j].ch_read;
                }
            }
        } else {
            delete chat[i];
        }
    }
    chat.ch_read = count;
    // console.log(chat);
    return chat;
}

module.exports = get_ro_list;