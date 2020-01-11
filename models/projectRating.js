module.exports = function (sequalize, DataTypes) {
    var projectReviews = sequalize.define("projectReviews", {
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        comments: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        projId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    return projectReviews;
}