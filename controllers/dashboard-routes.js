// DEPENDENCIES
// THE ROUTER AND THE DATABASE
const router = require('express').Router();
const sequelize = require('../config/connection');
// THE MODELS
const { Post, User, Comment } = require('../models');
// the authorization middleware to redirect unauthenticated users to the login page
const withAuth = require('../utils/auth')

// A ROUTE TO RENDER THE DASHBOARD PAGE, ONLY FOR A LOGGED IN USER
router.get('/', withAuth, (req, res) => {
  // ALL OF THE USERS POSTS ARE OBTAINED FROM THE DATABASE
  Post.findAll({
    where: {
      // USE THE ID FROM THE SESSION
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // SERIALIZE DATA BEFORE PASSING TO TEMPLATE
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// A ROUTE TO EDIT A POST
router.get('/edit/:id', withAuth, (req, res) => {
  // ALL OF THE USERS POSTS ARE OBTAINED FROM THE DATABASE
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // IF NO POST BY THAT ID EXISTS, RETURN AN ERROR
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      // SERIALIZE DATA BEFORE PASSING TO TEMPLATE
      const post = dbPostData.get({ plain: true });
      res.render('edit-post', { post, loggedIn: true });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;