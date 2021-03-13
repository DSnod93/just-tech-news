// VOTE MODEL
// DEPENDENCIES
// USE MODEL AND DATATYPE FROM SEQUELIZE
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// CREATE THE VOTE MODEL
class Vote extends Model { }

Vote.init(
    {
        // VOTE ID - THE PRIMARY KEY
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // REFERENCE TO THE USER ID OF THE VOTER
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        // REFERENCE TO THE POST ID OF THE POST RECEIVING THE VOTE
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'vote'
    }
)

module.exports = Vote; 