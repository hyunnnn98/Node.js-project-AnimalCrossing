// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Notice = models.Notice;

let set_notice = async (req, res) => {
    let {no_title, no_content} = req.body.payload;
    console.log(req.body);
    no_content = String(no_content);
    Notice.create({
        no_title,
        no_content
    })
    
    response(res, 200, true, "[성공]");
}

module.exports = set_notice;