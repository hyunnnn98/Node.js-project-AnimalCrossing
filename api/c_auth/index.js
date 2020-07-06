const login = require("./login");
exports.login = login;

const register = require("./register");
exports.register = register;

const email_access = require("./email_access");
exports.email_access = email_access;

const logout = require("./logout");
exports.logout = logout;

const token_check = require("./token_check");
exports.token_check = token_check;

const set_temp_password = require("./set_temp_password");
exports.set_temp_password = set_temp_password;

const update_password = require("./update_password");
exports.update_password = update_password;
