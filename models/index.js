//USER MODEL
const User = require('./User');
//POST MODEL
const Post = require("./Post");
// Vote model
const Vote = require('./Vote');


// Create associations between the models
// User-Post relationship
User.hasMany(Post, {
    foreignKey: 'user_id'
});
//Post-User relationship
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// User-Vote-Post through relationship
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

// Post-Vote-User through relationship
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// Vote-User relationship
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

// Vote-Post relationship
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

// User-Vote relationship
User.hasMany(Vote, {
    foreignKey: 'user_id'
});

// Post-Vote relationship
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});


module.exports = { User, Post, Vote };