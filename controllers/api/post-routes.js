// DEPENDENCIES
// EXPRESS.JS CONNECTION
const router = require('express').Router();
// USER MODEL AND POST MODEL
const { User, Post, Vote, Comment } = require('../../models');
// SEQUELIZE DATABASE CONNECTION
const sequelize = require('../../config/connection');
// THE AUTHORIZATION MIDDLEWARE TO REDIRECT UNAUTHENTICATED USERS TO THE LOGIN PAGE
const withAuth = require('../../utils/auth');

// ROUTES

// GET API/POSTS/ -- GET ALL POSTS
router.get('/', (req, res) => {
    Post.findAll({
        // QUERY CONFIGURATION
        // FROM THE POST TABLE, INCLUDE THE POST ID, URL, TITLE, AND THE TIMESTAMP FROM POST CREATION, AS WELL AS TOTAL VOTES
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        // ORDER THE POSTS FROM MOST RECENT TO LEAST
        order: [['created_at', 'DESC']],
        // FROM THE USER TABLE, INCLUDE THE POST CREATOR'S USER NAME
        // FROM THE COMMENT TABLE, INCLUDE ALL COMMENTS
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
        // RETURN THE POSTS
        .then(dbPostData => res.json(dbPostData))
        // IF THERE WAS A SERVER ERROR, RETURN THE ERROR
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET API/POSTS/:ID -- GET A SINGLE POST BY ID
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            // SPECIFY THE POST ID PARAMETER IN THE QUERY
            id: req.params.id
        },
        // QUERY CONFIGURATION, AS WITH THE GET ALL POSTS ROUTE
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
        .then(dbPostData => {
            // IF NO POST BY THAT ID EXISTS, RETURN AN ERROR
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            // IF A SERVER ERROR OCCURED, RETURN AN ERROR
            console.log(err);
            res.status(500).json(err);
        });
});

// POST API/POSTS -- CREATE A NEW POST
router.post('/', withAuth, (req, res) => {
    // EXPECTS OBJECT OF THE FORM {TITLE: 'SAMPLE TITLE HERE', POST_URL: 'HTTP://SOMESTRING.SOMEOTHERSTRING', USER_ID: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// PUT API/POSTS/UPVOTE -- UPVOTE A POST (THIS ROUTE MUST BE ABOVE THE UPDATE ROUTE, OTHERWISE EXPRESS.JS WILL TREAT UPVOTE AS AN ID)
router.put('/upvote', withAuth, (req, res) => {
    // MAKE SURE THAT A SESSION EXISTS, I.E. THAT A USER IS LOGGED IN
    if (req.session) {
        // PASS THE SESSION USER ID ALONG WITH THE REQ.BODY PROPERTIES (DESTRUCTURED) TO THE MODEL METHOD CREATED IN POST.JS FOR UPVOTES
        Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
            // RETURN THE DATA (LINES CHANGED)
            .then(updatedVoteData => res.json(updatedVoteData))
            // OR AN ERROR IF ONE OCCURS
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
    // IF A USER IS NOT LOGGED IN, SEND A BAD REQUEST ERROR
    else {
        res.status(400)
    }
});

// PUT API/POSTS/1-- UPDATE A POST'S TITLE
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
});

// DELETE API/POSTS/1 -- DELETE A POST
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;