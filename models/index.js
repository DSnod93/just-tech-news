// AN INDEX FILE TO GATHER THE MODELS AND EXPORT THEM FOR USE

// USER MODEL
const User = require('./User');
// POST MODEL
const Post = require('./Post');
// VOTE MODEL
const Vote = require('./Vote');
// COMMENT MODEL
const Comment = require('./Comment');

// CREATE ASSOCIATIONS BETWEEN THE MODELS
// USER-POST RELATIONSHIP
User.hasMany(Post, {
    foreignKey: 'user_id'
});
//POST-USER RELATIONSHIP
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// USER-VOTE-POST THROUGH RELATIONSHIP
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

// POST-VOTE-USER THROUGH RELATIONSHIP
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// VOTE-USER RELATIONSHIP
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

// VOTE-POST RELATIONSHIP
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

// USER-VOTE RELATIONSHIP
User.hasMany(Vote, {
    foreignKey: 'user_id'
});

// POST-VOTE RELATIONSHIP
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

// COMMENT-USER RELATIONSHIP
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

// COMMENT-POST RELATIONSHIP
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

// USER-COMMENT RELATIONSIHP
User.hasMany(Comment, {
    foreignKey: 'user_id'
});

// POST-COMMENT RELATIONSHIP
Post.hasMany(Comment, {
    foreignKey: 'post_id'
})

// EXPORT THE MODULES
module.exports = { User, Post, Vote, Comment };