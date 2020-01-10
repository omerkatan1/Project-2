module.exports = function (sequelize, DataTypes) {
    var UserBid = sequelize.define("UserBid", {
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bid_content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len:[0,1000]
            }
        },
        // bid_price: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // }
    });
    UserBid.associate = function (models) {
        UserBid.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
            }
        });
    }
    return UserBid;
}