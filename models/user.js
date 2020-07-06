module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('user', {
        us_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        us_email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "이메일 형식이 아닙니다."
                },
                notNull: true
            }
        },
        us_password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        us_thumbnail: { 
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notNull: true,
            }
        }, 
        us_nickname: { 
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notNull: true,
                is: {
                    args: /^[가-힣|a-z|A-Z|0-9|\s|\*]+$/i,
                    msg: "이름에 특수기호를 입력할 수 없습니다." 
                },
                len: {
                    args: [1, 10],
                    msg: "이름은 1~10자리까지 가능합니다."
                }
            }
        }, 
        us_islandname: { 
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notNull: true,
                is: {
                    args: /^[가-힣|a-z|A-Z|0-9|\s|\*]+$/i,
                    msg: "섬 이름에 특수기호를 입력할 수 없습니다." 
                },
                len: {
                    args: [1, 10],
                    msg: "섬 이름은 1~10자리까지 가능합니다."
                }
            }
        }, 
        us_island_selector: {
            type: DataTypes.INTEGER,
            defalutValue: 0
        },
        us_code: { 
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notNull: true,
                isNumeric: {
                    msg: "통신코드는 숫자만 입력가능합니다."  
                },
                len: {
                    args: [12, 12],
                    msg: "통신코드는 12자리 입니다."
                }
            },
        }, 
        us_grant: { 
            type: DataTypes.INTEGER, 
            defaultValue: 0
        }, 
        us_fcmtoken: { 
            type: DataTypes.STRING(255)
        },
        us_logintoken: { 
            type: DataTypes.STRING(255) 
        },
        us_access: {
            type: DataTypes.INTEGER,
            defalutValue: 0
        },
        us_access_token: {
            type: DataTypes.STRING(255)
        }
    }, 
    {
        tableName: "user",
        timestamps: false
    }); 
    
    return model;
}
