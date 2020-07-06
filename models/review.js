module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('review', { 
        rv_us_id: { 
            type: DataTypes.INTEGER
        },
        rv_write_us_id: {
            type: DataTypes.INTEGER  
        },
        rv_bo_id: { 
            type: DataTypes.INTEGER
        }, 
        rv_content: {
            type: DataTypes.STRING(255)
        },
        rv_rate: {
            type: DataTypes.INTEGER
        }
    }, 
    {
        tableName: "review",
        timestamps: true
    }); 
    
    // Remove default primary Keys
    model.removeAttribute('id');
    
    return model;
}