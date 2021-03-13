// AN INDEX FILE TO GATHER THE API ROUTES AND EXPORT THEM FOR USE

// DEPENDENCIES
// SERVER CONNECTION
const router = require('express').Router();
// USER ROUTES
const userRoutes = require('./user-routes');
// POST ROUTES
const postRoutes = require('./post-routes');
// COMMENT ROUTES
const commentRoutes = require('./comment-routes');

// DEFINE ROUTE PATH FOR THE API TO USE, E.G. API/USERS/
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

// EXPORT THE ROUTER
module.exports = router;