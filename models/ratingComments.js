module.exports = function (sequalize, DataTypes) {
    var reviews = sequalize.define("reviews", {
        avgRating: {
            type: DataTypes.STRING,
            allowNull: false,
            
        }
    })
}