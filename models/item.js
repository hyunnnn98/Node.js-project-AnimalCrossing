module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('item', { 
        it_id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }, 
        it_contents: {
            type: DataTypes.STRING(20)
        }
    }, 
    {
        tableName: "item",
        timestamps: false
    }); 

    return model;
}