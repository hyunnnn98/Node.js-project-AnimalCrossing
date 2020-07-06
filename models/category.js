module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('category', { 
        ca_id: { 
            type: DataTypes.INTEGER,
            primaryKey: true
        }, 
        ca_contents: {
            type: DataTypes.STRING(20)
        }
    }, 
    {
        tableName: "category",
        timestamps: false
    }); 

    return model;
}