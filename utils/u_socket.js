/*
    socket 통신
*/

// lib
const firebase = require("./u_firebase");

// controller
const ctrl = require("../api/c_chat");

let users = {};
let rooms = {};

let socket = (io) => {
    io.on('connection', (socket) => {
        console.log("접속 : ", socket.id);
        console.log('users: ', users, "/ rooms: ", rooms);
        
        /*
            get_info [유저 정보 저장]
            - 새로고침 or 프론트 라우터 전환시 유저의 데이터를 users에 저장
            - 채팅 도중 새로고침했을 경우 rooms안에 있는 key값과 비교해서 다시 rooms에 접속 & socket.id 교체
        */
        socket.on('get_info', async (us_id) => {
            // users에 user정보 입력
            socket.name = us_id;
            users[socket.name] = socket.id;
            
            // 룸에 이미 계정이 존재할 경우 socket.id를 "모두" 초기화 해준다
            for(let n in rooms) {
                for(let i = 0; i< rooms[n].length; i++) {
                    if(Object.getOwnPropertyNames(rooms[n][i])[0] === us_id) {
                        socket.join(Object.getOwnPropertyNames(rooms)[0]);
                        rooms[n][i][us_id] = socket.id;
                    }
                }
            }
            
            // console
            console.log("로그인 룸 확인 rooms: ", JSON.stringify(rooms));
            console.log('로그인 / users: ', users);
        });
        
        /* 
            get_chat_data [채팅방 정보 반환]
        */
        socket.on('get_chat_data', async (us_id) => {
            await get_room_list(us_id, socket.id);
        })

        /*
            get_read_count [읽지 않은 채팅 갯수 반환]
            - us_id 받은 대상의 읽지 않은 채팅 갯수 반환
        */
        socket.on('get_read_count',async (us_id) => {
            let count = await ctrl.get_read_count(us_id);
            io.to(socket.id).emit('get_read_count', count);
        })
        
        /* 
            create_room [거래 시작]
            - 채팅 room 입장
            - 판매자에게 거래해요 메시지 전송
            - 판매자의 채팅 정보 refresh
        */
        socket.on('create_room', async (us_id, bo_id) => {
            
            let bo_data = await ctrl.get_board_data(bo_id);
            let payload = {
                ro_bo_id: bo_data.bo_id,
                ro_us_id: us_id,
                ro_bo_title: bo_data.bo_title,
            }
            let ro_data = await ctrl.set_room(payload);
            let ro_id = ro_data.ro_id;
            await join_room(us_id, ro_id);
            
            // 판매자에게 메시지 전송
            let ch_content = `거래해요~!`;
            let ch_receive_us_id = bo_data.bo_us_id;
            payload = {
                ch_ro_id: ro_id,
                ch_send_us_id: us_id,
                ch_receive_us_id,
                ch_content,
                ch_request: 0
            }
            await send_message(payload);
            
            // 판매자의 채팅 정보 가져와 refresh
            get_room_list(ch_receive_us_id, users[ch_receive_us_id]);
            
            io.to(socket.id).emit('create_room', ro_id);
        })
        
        /* 
            join_room [룸에 입장]
            - 데이터베이스에 해당 룸의 안읽은 채팅 읽음으로 처리
            - 중복으로 입장할 경우 차단
            - 룸에 입장
        */
        socket.on('join_room', async (us_id, ro_id) => {
            // 모두 읽음 처리
            await ctrl.set_read(us_id, ro_id);
            
            let _us_id = await ctrl.get_us_id(us_id, ro_id);
            
            let exist = false;
            
            // 중복임 바꿔야함
            if(rooms[ro_id]) {
                for(let i = 0; i < rooms[ro_id].length; i++) {
                    if(rooms[ro_id][i][_us_id]) {
                        exist = true;
                    }
                }
                
                if(exist) {
                    // 상대방 읽음 처리
                    get_message(us_id, ro_id, users[_us_id]);
                }
            }
            
            
            
            // 중복 입장 차단
            try{
                for(let i = 0; i< rooms[ro_id].length; i++) {
                if(rooms[ro_id] && rooms[ro_id][i][us_id]) {
                    socket.join(ro_id);
                    return;
                }
            }
            }catch(error) {}
            
            // 룸 입장
            join_room(us_id, ro_id);
            
            // console
            console.log(us_id, '-룸에 입장 / rooms: ', JSON.stringify(rooms));
        })
        
        /*
            send_message [메세지 전송]
            - 프론트에서 직접적으로 메세지를 전송 할 경우(일반 채팅 & 거래해요 메세지)
        */
        socket.on('send_message', async (us_id, ro_id, ch_content) => {
            
            // 채팅 상대 id 반환
            let ch_receive_us_id = await ctrl.get_us_id(us_id, ro_id);
            
            let payload = {
                ch_ro_id: ro_id,
                ch_send_us_id: us_id,
                ch_receive_us_id,
                ch_content,
                ch_request: 0
            }
            
            // 메세지 정송
            send_message(payload);
        })
        
        /*
            leave_room [채팅방 나가기]
        */
        socket.on('leave_room', async (us_id, ro_id) => {
            leave_room(us_id, ro_id);
        })
        
        /*
            delete_room [채팅방 삭제]
        */
        socket.on('delete_room', async (us_id, ro_id) => {
            delete_room(us_id, ro_id);
        })
        
        /*
            get_message [채팅방에 들어갔을 경우 채팅 내역 반환]
        */
        socket.on('get_message', async (us_id, ro_id) => {
            get_message(us_id, ro_id, socket.id);
        })
        
        /*
            delete_account [회원 탈퇴]
        */
        socket.on('delete_account', async (us_id) => {
            let room = await ctrl.get_delete_room_list(us_id);
            console.log("delete_account room", room);
            for(let i = 0; i < room.length; i++) {
                delete_room(us_id, room[i].ch_ro_id);
            }
        })
        
        /*
            disconnect [유저의 접속이 끊겼을 경우]
            - users의 유저 데이터 삭제
        */
    	socket.on('disconnect', () => { 
    	    delete users[socket.name];
    	    console.log(socket.name, ' 로그아웃 / users: ', users);
    	});
        
        /*
        거래 프로세스 - bo_trade_status
        
        0 아무 상태 아님
        1 거래 요청 상태
        2 거래 승락 상태 ( 통신코드 전송 )
        3 거래 완료 요청 상태
        4 거래 완료 요청 승락 상태 ( 거래 완료 & 후기 작성 )
        */
        
        /*
            request_trade_access [거래 요청 & 승락]
            - bo_trade_status 거래 단계에 따른 처리
        */
        socket.on('request_trade_access', async (us_id, ro_id) => {
            let ro_data = await ctrl.get_ro_data(ro_id);
            let bo_id = ro_data.ro_bo_id;
            let board_data = await ctrl.get_board_data(bo_id);
            let ch_send_us_id = us_id;
            let ch_content;
            let ch_request;
            let buy_us_id = ro_data.ro_us_id;
            let ch_receive_us_id = await ctrl.get_us_id(us_id, ro_id);
            
            if(ro_data.ro_trade_status == 0) {
                let bo_cost_selector;
                    
                if(board_data.bo_cost_selector == 0) {
                    bo_cost_selector = "덩";
                } else {
                    bo_cost_selector = "마일";
                }
                
                ch_content = `판매자가 거래 승인요청을 보냈습니다.\n\n승인요청을 누르시면 통신코드가 교환됩니다.\n${ board_data.bo_cost } ${bo_cost_selector}`;
                
                ch_request = 1;
                let payload = {
                    ch_ro_id: ro_id,
                    ch_send_us_id,
                    ch_receive_us_id,
                    ch_content,
                    ch_request
                }
                send_message(payload);
                
                await set_ro_trade_status(ro_id, 1);
                io.to(ro_id).emit('request_trade_access', 1);
            } else if (ro_data.ro_trade_status == 1) {
                if(buy_us_id == us_id) {
                    let ch_send_us_id_data = await ctrl.get_us_data(ch_send_us_id);
                    let ch_receive_us_id_data = await ctrl.get_us_data(ch_receive_us_id);
                    
                    ch_content = `거래를 승인하였습니다.\n\n${ch_send_us_id_data.us_nickname}: ${ch_send_us_id_data.us_code}\n${ch_receive_us_id_data.us_nickname}: ${ch_receive_us_id_data.us_code}`;
                    let payload = {
                        ch_ro_id: ro_id,
                        ch_send_us_id,
                        ch_receive_us_id,
                        ch_content,
                        ch_request: 0
                    }
                    send_message(payload);
                    await set_ro_trade_status(ro_id, 2);
                    io.to(ro_id).emit('request_trade_access', 2);
                }                
            } else if (ro_data.ro_trade_status == 2) {
                ch_content = `판매자가 거래 완료요청을 보냈습니다.\n\n`;
                
                ch_request = 2;
                let payload = {
                    ch_ro_id: ro_id,
                    ch_send_us_id,
                    ch_receive_us_id,
                    ch_content,
                    ch_request
                }
                send_message(payload);
                
                await set_ro_trade_status(ro_id, 3);
                io.to(ro_id).emit('request_trade_access', 3);
            } else if (ro_data.ro_trade_status == 3) {
                if(buy_us_id == us_id) {
                    ch_content = `거래가 완료되었습니다.`;
                    let payload = {
                        ch_ro_id: ro_id,
                        ch_send_us_id,
                        ch_receive_us_id,
                        ch_content,
                        ch_request: 0
                    }
                    send_message(payload);
                    
                    ch_content = `거래는 만족스러우셨나요?\n후기작성은 판매자에게 큰 힘이 됩니다.`;
                    ch_request = 3;
                    payload = {
                        ch_ro_id: ro_id,
                        ch_send_us_id,
                        ch_receive_us_id,
                        ch_content,
                        ch_request
                    }
                    send_message(payload);
                    await set_ro_trade_status(ro_id, 4);
                    io.to(ro_id).emit('request_trade_access', 4);
                }    
            }
        })
        
        socket.on('set_blacklist', async (us_id, ro_id, bl_content) => {
            let bl_victim_us_id = await ctrl.get_us_id(us_id, ro_id);
            
            let ro_data = await ctrl.get_ro_data(ro_id);
            
            let bl_bo_id = ro_data.ro_bo_id;
            let check = await ctrl.reject_overlap_blacklist(us_id, bl_victim_us_id);
            
            if(!check.length){
                let payload = {
                    bl_bo_id,
                    bl_attacker_us_id: us_id,
                    bl_victim_us_id,
                    bl_content
                }
                
                let user_data = await ctrl.get_us_data(us_id);
                
                let notification = {
                   title: "신고를 당해 활동이 제한됩니다.",
                   body: user_data.us_nickname + " 님으로 부터 신고를 당했습니다.\n자세한 내용은 내 정보에서 확인해주세요."
                }
                
                firebase(bl_victim_us_id, notification);
                await ctrl.set_blacklist(payload);
            }
        })
        
        let leave_room = (us_id, ro_id) => {
            if(rooms[ro_id]){
                // rooms 채팅방에 들어있는 유저 삭제
                for(var i = 0; i < rooms[ro_id].length; i++) {
                    if(Object.getOwnPropertyNames(rooms[ro_id][i])[0] == us_id) {
                        delete rooms[ro_id][i];
                    }
                }
                // 채팅방 나가고 남은 잔해 제거
                rooms[ro_id] = rooms[ro_id].filter(function (el) {return el != null;});
                
                // rooms 에 아무도 없을 경우 룸 자체를 삭제
                if(rooms[ro_id].length == 0){
                    delete rooms[ro_id];
                }
                
                // socket 룸 나감
                socket.leave(ro_id);
            }
            // console
            console.log(us_id, "이 ",ro_id," 방에서 나감 / 남은 방 목록: ", JSON.stringify(rooms));  
        }
        let set_ro_trade_status = (ro_id, status) => {
            ctrl.set_ro_trade_status(ro_id, status);
        }
        
        let send_message = async (payload) => {
            let {ch_ro_id, ch_send_us_id, ch_receive_us_id, ch_content, ch_request} = payload;
            
            let message;
            
            let exist = false;
            
            try {
               for(let i = 0; i < rooms[ch_ro_id].length; i++) {
                    if(rooms[ch_ro_id][i][ch_receive_us_id]) {
                        exist = true;
                    }
                } 
            } catch(error) {}
            
            console.log("exist", exist);
            
            message = await ctrl.send_message(payload, exist);
            if(exist) {
                io.to(ch_ro_id).emit('send_message', message);
            } else {
                // 상대방이 채팅방에 없는 경우
                io.to(socket.id).emit('send_message', message);
                let user_data = await ctrl.get_us_data(ch_receive_us_id);
                let notification = {
                    title: user_data.us_nickname,
                    body: ch_content
                }
                get_room_list(ch_receive_us_id, users[ch_receive_us_id]);

                firebase(ch_receive_us_id, notification);
            }
            let count = await ctrl.get_read_count(ch_receive_us_id);
            io.to(users[ch_receive_us_id]).emit('get_read_count', count);
        }
        
        let join_room = (us_id, ro_id) => {
            // 룸 입장
    	    let user = {};
    	    user[us_id] = socket.id;
    	    
    	    let room = {};
    	    room[ro_id] = [user];
    	    
    	    if(rooms[ro_id]) {
    	        rooms[ro_id].push(user);
    	    }else {
    	        rooms[ro_id] = [user]
    	    }
            socket.join(ro_id);
        }
        
        let get_room_list = async (us_id, socket_id) => {
            let ro_list = await ctrl.get_ro_list(us_id);
    	    io.to(socket_id).emit('get_chat_data', ro_list);
        }
        
        let get_message = async (us_id, ro_id, socket_id) => {
            // 구매자 & 판매자 us_id 값 받아옴
            let ro_data = await ctrl.get_ro_data(ro_id);
            
            let buy_us_id = ro_data.ro_us_id;
            let seller_us_id = await ctrl.get_us_id(buy_us_id, ro_id);
            
            // 구매자 & 판매자도 아닌 사람이 접근했을 경우 false 반환
            if(us_id != buy_us_id && us_id != seller_us_id) {
                io.to(socket.id).emit('get_message', false);
            } else {
                // 채팅 내역 반환
                let chat = await ctrl.get_chat(ro_id);
                
                // 현재 거래 상태 반환
                let ro_trade_status = ro_data.ro_trade_status;
                let ro_bo_title = ro_data.ro_bo_title;
                let ro_exit = ro_data.ro_exit;
                let other_us_id = await ctrl.get_us_id(us_id, ro_id);
                let other_us_data = await ctrl.get_us_data(other_us_id);
                let us_grant;
                let us_nickname;
                if(other_us_data) {
                    us_grant = other_us_data.us_grant;
                    us_nickname = other_us_data.us_nickname;
                } else {
                    us_grant = 0;
                    us_nickname = "이름 없음"
                }
                let result = {
                    chat,
                    ro_trade_status,
                    ro_bo_title,
                    ro_exit,
                    us_grant,
                    us_nickname
                }
                // 프론트로 데이터 전송
                io.to(socket_id).emit('get_message', result);
            }
        }
        
        let delete_room = async (us_id, ro_id) => {
            let _us_id = await ctrl.get_us_id(us_id, ro_id);
            let result = await ctrl.delete_room(us_id, ro_id);

            if(!result) {
                // 아직 채팅방이 살아 있을 경우
                let ch_content = "상대방이 대화방에서 나갔습니다.";
                
                let payload = {
                    ch_ro_id: ro_id,
                    ch_send_us_id: us_id,
                    ch_receive_us_id: _us_id,
                    ch_content,
                    ch_request: 0
                }
                send_message(payload);
                get_message(us_id, ro_id, users[_us_id]);
            }
            leave_room(us_id, ro_id);
        }
    });
}

module.exports = socket;
