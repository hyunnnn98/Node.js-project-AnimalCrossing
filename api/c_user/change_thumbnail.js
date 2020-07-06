/*

*/

// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const User = models.User;

let change_thumbnail = async (req, res) => {
    
    let files = req.files;
    let us_id = req.headers.us_id;
    
    if(files.length){
        let location = files[0].Location;
        User.update({
            us_thumbnail: location
        }, {
            where: {us_id}
        })
    }

}

module.exports = change_thumbnail;