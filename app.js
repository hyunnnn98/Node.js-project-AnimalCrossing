/* 모듈 호출 */
const express = require('express');
const app = express();
const cors = require('cors');
const cookie_parser = require('cookie-parser');
const bodyParser = require('body-parser');

/* 데이터베이스 연결 */
const models = require("./models/index.js");

models.sequelize.sync().then( () => {
	console.log(" DB connect");
}).catch(err => {
	console.log(" DB connect fail");
	console.log(err);
});

const http = require('http');

const httpServer = http.createServer(app);


/* 모듈 적용 */

// body-paerser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// use static folder
app.use(express.static('public'));
// cors
app.use(cors());
// cookie-parser
app.use(cookie_parser());

/* 소켓 생성 */
const io = require("socket.io")(httpServer);
const socket = require("./utils/u_socket");
socket(io);

/* 라우터 호출 */
const router = express.Router();

const authRouter = require('./router/r_auth')(router);
app.use('/auth', authRouter);

const userRouter = require('./router/r_user')(router);
app.use('/user', userRouter);

const boardRouter = require('./router/r_board')(router);
app.use('/board', boardRouter);

const reviewRouter = require('./router/r_review')(router);
app.use('/review', reviewRouter);

const adminRouter = require('./router/r_admin')(router);
app.use('/admin', adminRouter);

const homeRouter = require('./router/r_home')(router);
app.use('/', homeRouter);
