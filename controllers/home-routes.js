// USER FACING ROUTES FROM HANDLEBARS
//DEPENDENCIES
// ROUTER
const router = require('express').Router();
// SEQUELIZE AND THE POST, USER, AND COMMENT MODELS
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models')
// ROUTE TO GET THE HOMEPAGE AND RENDER ALL THE POSTS
router.get('/', (req, res) => {
  // CONSOLE LOG THE SESSION INFORMATION
  console.log(req.session)
  // GET THE POSTS FROM THE DATABASE
  Post.findAll({
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
      // CREATE AN ARRAY FOR THE POSTS, USING THE GET METHOD TO TRIM EXTRA SEQUELIZE OBJECT DATA OUT
      const posts = dbPostData.map(post => post.get({ plain: true }));
      // PASS THE POSTS INTO THE HOMEPAGE TEMPLATE
      res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// ROUTE TO RENDER A SINGLE POST PAGE USING SEQUELIZE FINDONE ROUTE
router.get('/post/:id', (req, res) => {
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
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // SERIALIZE THE DATA
      const post = dbPostData.get({ plain: true });

      // PASS DATA TO TEMPLATE FOR THE POST AND FOR IF THERE IS AN ACTIVE SESSION, I.E. A LOGGED IN USER
      res.render('single-post', {
        post,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// ROUTE TO RENDER THE LOGIN PAGE
router.get('/login', (req, res) => {
  // IF A SESSION IS ALREADY DETECTED, REROUTE TO THE HOMEPAGE
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  // OTHERWISE, RENDER THE LOGIN PAGE
  res.render('login');
});
// EXPORT THE ROUTER
module.exports = router;