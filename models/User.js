// USER MODEL
// DEPENDENCIES
// USE MODEL AND DATATYPE FROM SEQUELIZE
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// USE BCRYPT FOR PASSWORD HASHING
const bcrypt = require('bcrypt');

// CREATE THE USER MODEL
class User extends Model {
    // SET UP A METHOD TO RUN ON A USER INSTANCE TO CHECK THE PASSWORD AS PROVIDED 
    // IN THE LOGIN ROUTE AGAINST THE HASHED DATABASE PASSWORD
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// DEFINE THE TABLE COLUMNS AND CONFIGURATION
User.init(
    {
        // TABLE COLUMN DEFINITIONS
        // DEFINE AN ID COLUMN
        id: {
            // USE THE SPECIAL SEQUELIZE DATATYPES OBJECT TO DEFINE WHAT TYPE OF DATA IT IS
            type: DataTypes.INTEGER,
            // THIS IS THE SEQUELIZE EQUIVALENT OF SQL'S `NOT NULL` OPTION
            allowNull: false,
            // DEFINE THIS COMUMN AS THE THE PRIMARY KEY
            primaryKey: true,
            // TURN ON AUTO INCREMENT
            autoIncrement: true
        },
        // DEFINE A USERNAME COLUMN
        username: {
            // DEFINE THE DATA TYPE
            type: DataTypes.STRING,
            // REQUIRE THE DATA TO BE ENTERED
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        // DEFINE AN EMAIL COLUMN
        email: {
            // DEFINE THE DATA TYPE
            type: DataTypes.STRING,
            // REQUIRE THE DATA TO BE ENTERED
            allowNull: false,
            // DO NOT ALLOW DUPLICATE EMAIL VALUES IN THIS TABLE
            unique: true,
            // IF ALLOWNULL IS SET TO FALSE, THE DATA CAN BE VALIDATED BEFORE CREATING THE TABLE DATA
            validate: {
                // THIS WILL CHECK THE FORMAT OF THE ENTRY AS A VALID EMAIL BY PATTERN CHECKING <STRING>@<STRING>.<STRING>
                isEmail: true
            }
        },
        // DEFINE A PASSWORD COLUMN
        password: {
            // DEFINE THE DATA TYPE
            type: DataTypes.STRING,
            // REQUIRE THE DATA TO BE ENTERED
            allowNull: false,
            validate: {
                // THIS MEANS THE PASSWORD MUST BE AT LEAST FOUR CHARACTERS LONG
                len: [4]
            }
        }
    },
    {
        // TABLE CONFIGURATION OPTIONS (https://sequelize.org/v5/manual/models-definition.html#configuration))
        // ADD HOOKS FOR THE PASSWORD HASHING OPERATION
        hooks: {
            // SET UP A BEFORECREATE LIFECYCLE HOOK TO HASH THE PASSWORD BEFORE THE OBJECT IS CREATED IN THE DATABASE
            // AND RETURN THE NEW USERDATA OBJECT
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // SET UP A BEFOREUPDATE LIFECYCLE HOOK TO HASH THE PASSWORD BEFORE A USER OBJECT IS UPDATED IN THE DATABASE
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // PASS IN THE IMPORTED SEQUELIZE CONNECTION TO THE DATABASE
        sequelize,
        // DO NOT AUTOMATICALLY CREATE CREATEDAT/UPDATEDAT TIMESTAMP FIELDS
        timestamps: false,
        // DO NOT PLURALIZE NAME OF DATABASE TABLE
        freezeTableName: true,
        // USE UNDERSCORES INSTEAD OF CAMEL-CASING (I.E. `COMMENT_TEXT` AND NOT `COMMENTTEXT`)
        underscored: true,
        // MAKE IT SO THE MODEL NAME STAYS LOWERCASE IN THE DATABASE
        modelName: 'user'
    }
);

// EXPORT USER 
module.exports = User;
