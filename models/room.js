module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('room', { 
        ro_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ro_bo_id: {
            type: DataTypes.INTEGER  
        },
        ro_us_id: {
            type: DataTypes.INTEGER
        },
        ro_bo_title: {
            type: DataTypes.STRING(255)
        },
        ro_trade_status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        ro_exit: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, 
    {
        tableName: "room",
        timestamps: false
    }); 

    // Remove default primary Keys
    model.removeAttribute('id');
    
    return model;
}