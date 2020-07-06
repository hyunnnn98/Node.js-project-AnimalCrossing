module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('report', { 
        re_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,  
        },
        re_bl_id: {
            type: DataTypes.INTEGER,
        },
        re_us_id: { 
            type: DataTypes.INTEGER, 
        },
        re_title: { 
            type: DataTypes.STRING(50)
        }, 
        re_content: {
            type: DataTypes.TEXT
        },
        re_category: {
            type: DataTypes.STRING(255)
        },
        re_status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, 
    {
        tableName: "report",
        timestamps: false
    }); 
    
    // Remove default primary Keys
    model.removeAttribute('id');
    
    return model;
}