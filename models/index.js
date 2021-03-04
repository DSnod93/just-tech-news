//USER MODEL
const User = require('./User');
//POST MODEL
const Post = require("./Post");

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Post };