module.exports = function (sequelize, DataTypes) {
    var Project = sequelize.define("Project", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        },

        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 500
            }
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Hiring",
        },

        // // organization_id: {
        // //     type: DataTypes.INTEGER,
        // //     allowNull: false,
        // },

        developers_list: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            // get() {
            //     return this.getDataValue('developers_list').split(';')
            // },
            // set(val) {
            //     this.setDataValue('developers_list', val.join(';'));
            // },
        },

        final_developer: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },

    });
    Project.associate = function (models) {
        Project.belongsTo(models.Org, {
            foreignKey: {
                allowNull: false,
            }
        });
        // Project.belongsTo(models.User, {
        //     foreignKey: {
        //         allowNull: true,
        //     }
        // });

    };

    // Project.associate = function(models) {
    //     Project.belongsTo(models.User, {
    //         foreignKey: 'user_id',
    //         allowNull: true,
    //       });
    // };
    return Project;
};