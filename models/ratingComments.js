module.exports = function (sequalize, DataTypes) {
    var reviews = sequalize.define("reviews", {
        rating: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comments: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    reviews.associate = function (models) {
        reviews.belongsTo(models.User, {
            allowNull: false
        });
    }
    return reviews;
}