module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('likehate', { 
        lh_us_id: { 
            type: DataTypes.INTEGER
        }, 
        lh_bo_id: {
            type: DataTypes.INTEGER
        },
        lh_either: { 
            type: DataTypes.INTEGER
        }
    }, 
    {
        tableName: "likehate",
        timestamps: false
    }); 
    
    // Remove default primary Keys
    model.removeAttribute('id');
    
    return model;
}