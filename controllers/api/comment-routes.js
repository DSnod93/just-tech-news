// DEPENDENCIES
// EXPRESS.JS CONNECTION
const router = require('express').Router();
// COMMENT MODEL
const { Comment } = require('../../models');
// THE AUTHORIZATION MIDDLEWARE TO REDIRECT UNAUTHENTICATED USERS TO THE LOGIN PAGE
const withAuth = require('../../utils/auth');

// ROUTES

// GET COMMENTS
router.get('/', (req, res) => {
  // ACCESS THE COMMENT MODEL AND RUN .FINDALL() METHOD TO GET ALL COMMENTS
  Comment.findAll()
    // RETURN THE DATA AS JSON FORMATTED
    .then(dbCommentData => res.json(dbCommentData))
    // IF THERE IS A SERVER ERROR, RETURN THAT ERROR
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST A NEW COMMENT
router.post('/', withAuth, (req, res) => {
  // CHECK THE SESSION, AND IF IT EXISTS, CREATE A COMMENT
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      // USE THE USER ID FROM THE SESSION
      user_id: req.session.user_id
    })
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
});

// DELETE A COMMENT
router.delete('/:id', withAuth, (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbCommentData => {
      if (!dbCommentData) {
        res.status(404).json({ message: 'No comment found with this id' });
        return;
      }
      res.json(dbCommentData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;