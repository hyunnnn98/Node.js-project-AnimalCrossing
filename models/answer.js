module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('answer', { 
        an_re_id: {
            type: DataTypes.INTEGER,
        },
        an_content: {
            type: DataTypes.STRING(255)
        },
    }, 
    {
        tableName: "answer",
        timestamps: false
    }); 
    
    // Remove default primary Keys
    model.removeAttribute('id');
    
    return model;
    
}