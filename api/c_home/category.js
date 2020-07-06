
// modules
const response = require("../../utils/u_res");

// models
const models = require("../../models");
const Category = models.Category;

let category = async (req, res) => {
    let category = await Category.findAll()
    .catch((error) => {
        response(res, 500, false, "[에러]서버 오류로 카테고리 값을 받아오지 못했습니다", error);
    });
    
    response(res, 200, true, "[완료]카테고리 반환", category);
}

module.exports = category;

