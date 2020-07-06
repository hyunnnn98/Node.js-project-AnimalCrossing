//lib
const bcrypt = require("bcrypt");

let hash = {
    /*  encrypt password
      NOTE: 10 is saltround which is a cost factor
      cost가 10 이라는 말은 = 2^10qjs 돌린다는 뜻임. cost가 높아질수록 보안은 올라가지만, 속도가 느려진다.
      bcrypt는 단방향 해시 함수를 이용한 모듈이다.
      salt 란? 해쉬 암호화 된 비밀번호 + 기존 비밀번호를 합치는 과정을 말함.
    */
    hashing: async (param) => {
        const result = await new Promise((resolve, reject) => {
            try{
                bcrypt.hash(param, 10, (error, hashed) => {
                    if (error) {
                        reject(error);
                    }else {
                        resolve(hashed);
                    }
                }); 
            } catch(error) {
                console.log("hash: param값이 넘어오지 않음");
            }

        });
        return result;
    },
    compare: async (param1, param2) => {
        const result = await new Promise((resolve, reject) => {
            bcrypt.compare(param1, param2, (error, result) => {
                if(error) {
                    console.log('', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        });
        return result;
    }
}
module.exports = hash;