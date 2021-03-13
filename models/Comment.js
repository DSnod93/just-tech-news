// COMMENT MODEL
// DEPENDENCIES
// SEQUELIZE MODEL, DATATYPES, AND DATABASE CONNECTION
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// THE COMMENT MODEL EXTENDS THE SEQUELIZE MODEL 
class Comment extends Model { }

// DEFINE THE TABLE COLUMNS AND CONFIGURATION, SIMILAR TO THE SETUP FOR THE OTHER MODELS
Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        comment_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // COMMENT MUST BE AT LEAST ONE CHARACTER LONG
                len: [1]
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'post',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment'
    }
)

// EXPORT THE MODEL
module.exports = Comment;