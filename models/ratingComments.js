module.exports = function (sequalize, DataTypes) {
    var reviews = sequalize.define("reviews", {
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        ratingNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });
    reviews.associate = function (models) {
        reviews.belongsTo(models.User, {
            allowNull: false
        });
    }
    return reviews;
}