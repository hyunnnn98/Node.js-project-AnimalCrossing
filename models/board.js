module.exports = (sequelize, DataTypes) => { 
    let model = sequelize.define('board', { 
        bo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bo_us_id: { 
            type: DataTypes.INTEGER
        }, 
        bo_title: { 
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "제목을 입력해주세요."
                },
                len: {
                    args: [1, 20],
                    msg: "이름은 20자리까지 가능합니다."
                }
            }
        }, 
        bo_content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "내용을 입력해주세요."
                }
            }
        },
        bo_category: {
            type: DataTypes.INTEGER
        },
        bo_show: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        bo_like: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        bo_hate: {
            type: DataTypes.INTEGER,
            defaultValue: 0           
        },
        bo_trade_value: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        bo_trade_status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        bo_thumbnail: {
            type: DataTypes.STRING(100)
        },
        bo_view: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        bo_cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
                isNumeric: {
                    msg: "가격은 숫자만 입력가능합니다."  
                },
                len: {
                    args: [1, 5],
                    msg: "가격은 5자리까지 입력 가능합니다."
                }
            },
        },
        bo_cost_selector: {
            type: DataTypes.INTEGER
        }
    }, 
    {
        tableName: "board",
        timestamps: true
    }); 
    
    return model;
}

// 2020-05-22 조회수 추가
