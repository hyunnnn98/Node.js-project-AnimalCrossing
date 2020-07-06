module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('request', { 
        rq_id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
        }, 
        rq_content: {
            type: DataTypes.STRING(20)
        }
    }, 
    {
        tableName: "request",
        timestamps: false
    }); 

    return model;
}