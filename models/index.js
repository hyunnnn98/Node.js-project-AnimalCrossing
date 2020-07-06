'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Answer = require('./answer')(sequelize, Sequelize);
db.Board = require('./board')(sequelize, Sequelize);
db.Blacklist = require('./blacklist')(sequelize, Sequelize);
db.Category = require('./category')(sequelize, Sequelize);
db.Chat = require('./chat')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Item = require('./item')(sequelize, Sequelize);
db.Likehate = require('./likehate')(sequelize, Sequelize);
db.Notice = require('./notice')(sequelize, Sequelize);
db.Report = require('./report')(sequelize, Sequelize);
db.Request = require('./request')(sequelize, Sequelize);
db.Review = require('./review')(sequelize, Sequelize);
db.Room = require('./room')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

db.Board.belongsTo(db.User, {foreignKey: 'bo_us_id', targetKey: 'us_id'});
db.Board.belongsTo(db.Category, {foreignKey: 'bo_category', targetKey: 'ca_id'});
// db.Board.hasMany(db.Category, {foreignKey: 'ca_id', sourceKey: 'bo_category'});

db.Chat.belongsTo(db.Request, {foreignKey: 'ch_request', targetKey: 'rq_id'});
db.Chat.belongsTo(db.Room, {foreignKey: 'ch_ro_id', targetKey: 'ro_id'});

db.Image.belongsTo(db.Board, {foreignKey: 'im_bo_id', targetKey: 'bo_id'});

db.Likehate.belongsTo(db.User, {foreignKey: 'lh_us_id', targetKey: 'us_id'});
db.Likehate.belongsTo(db.Board, {foreignKey: 'lh_bo_id', targetKey: 'bo_id'});

db.Report.belongsTo(db.Blacklist, {foreignKey:'re_bl_id', targetKey: 'bl_id'});

db.User.hasMany(db.Review, {foreignKey: 'rv_write_us_id', sourceKey: 'us_id'});

db.Review.belongsTo(db.User, {foreignKey: 'rv_write_us_id', targetKey: 'us_id'});
db.Review.belongsTo(db.Board, {foreignKey: 'rv_bo_id', targetKey: 'bo_id'});

module.exports = db;
