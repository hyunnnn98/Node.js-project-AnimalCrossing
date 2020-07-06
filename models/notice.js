module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('notice', { 
        no_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,  
        },
        no_title: { 
            type: DataTypes.STRING(50)
        }, 
        no_content: {
            type: DataTypes.TEXT
        },
    }, 
    {
        tableName: "notice",
        timestamps: true
    }); 
    
    // Remove default primary Keys
    model.removeAttribute('id');
    
    return model;
}