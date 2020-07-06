module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('blacklist', { 
        bl_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        bl_bo_id: {
            type: DataTypes.INTEGER  
        },
        bl_victim_us_id: { 
            type: DataTypes.INTEGER
        }, 
        bl_attacker_us_id: { 
            type: DataTypes.INTEGER
        },
        bl_us_email: {
            type: DataTypes.STRING(100)  
        },
        bl_content: {
            type: DataTypes.STRING(255)
        },
        bl_us_grant: {
            type: DataTypes.INTEGER
        }
    }, 
    {
        tableName: "blacklist",
        timestamps: false
    }); 
    
    // Remove default primary Keys
    model.removeAttribute('id');
    
    return model;
    
}