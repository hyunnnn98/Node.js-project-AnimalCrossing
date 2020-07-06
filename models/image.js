module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('image', { 
        im_bo_id: { 
            type: DataTypes.INTEGER
        }, 
        im_location: {
            type: DataTypes.STRING(255)
        }
    }, 
    {
        tableName: "image",
        timestamps: false
    }); 
    
    // Remove default primary Keys
    model.removeAttribute('id');
    
    return model;
}