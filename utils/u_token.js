// models
const User = require('../models').User;

// config
const jwt = require('jsonwebtoken');
const config = require("../config/jwt")

// 새로운 토큰 발행하기.
// 파라미터로 select * from user의 모든 정보 받아왔음.

let token = (user) => {
    const payload = {
        us_nickname: user.us_nickname,
        us_email: user.us_email
    };
    // 리터럴 객체로 데이터 넣은 후 json web token으로 토큰 발행.
    return jwt.sign(payload, config.SECRET_KEY, {
        expiresIn: config.EXPIRATION_DATE, // EXPIRATION_DATE은 유효 기간이다.
    });
};

// 프로미스의 resolve, reject는 비동기 작업의 처리과정에서 성공/실패를 구분하는 방법이다.
// 토큰 검증하기. => 파라메터에 토큰 실어서 받아온다.
let verifyToken = token =>
    new Promise((resolve, reject) => {
        // 토큰 검증해서 비동기 작업 처리 과정의 성공 / 실패 를 반환한다.
        jwt.verify(token, config.SECRET_KEY, (err, payload) => {
            if (err) return reject(err);
            resolve(payload);
        });
    });

// middleware 미들 웨어 설정
// TODO 미들웨어 쿼리문 Sequelize문으로 변경
exports.authenticateUser = async (req, res, next) => {
    // 해더에 토큰이 없는 경우
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'token must be included' });
    }

    // 헤더에 토큰이 있는 경우
    let token = req.headers.authorization;
    let payload;
    
    try {
        payload = await verifyToken(token);
    } catch (error) {
        return res.status(401).json({ message: 'token is invalid' });
    }

    let user = await User.findAll({
        attributes: { exclude: ['us_password'] },
        where: { us_email: payload.us_email },
        plain: true,
    });

    // 홈페이지 접속자가 토큰은 보유하고 있지만 회원이 아닌 경우
    if (!user) {
        return res.status(401).json({ message: 'user is not found' });
    }

    req.user = user;
    next();
};

module.exports = token;