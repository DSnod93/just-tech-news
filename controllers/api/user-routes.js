// DEPENDENCIES
// EXPRESS.JS CONNECTION
const router = require('express').Router();
// USER, POST, VOTE MODELS
const { User, Post, Vote, Comment } = require('../../models');
// EXPRESS SESSION FOR THE SESSION DATA
const session = require('express-session');
const withAuth = require('../../utils/auth');
// SEQUELIZE STORE TO SAVE THE SESSION SO THE USER CAN REMAIN LOGGED IN
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// ROUTES

// GET /API/USERS -- GET ALL USERS
router.get('/', (req, res) => {
    // ACCESS THE USER MODEL AND RUN .FINDALL() METHOD TO GET ALL USERS
    User.findAll({
        // WHEN THE DATA IS SENT BACK, EXCLUDE THE PASSWORD PROPERTY
        attributes: { exclude: ['password'] }
    })
        // RETURN THE DATA AS JSON FORMATTED
        .then(dbUserData => res.json(dbUserData))
        // IF THERE IS A SERVER ERROR, RETURN THAT ERROR
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /API/USERS/1 -- GET A SINGLE USER BY ID
router.get('/:id', (req, res) => {
    // ACESS THE USER MODEL AND RUN THE FINDONE() METHOD TO GET A SINGLE USER BASED ON PARAMETERS
    User.findOne({
        // WHEN THE DATA IS SENT BACK, EXCLUDE THE PASSWORD PROPERTY
        attributes: { exclude: ['password'] },
        where: {
            // USE ID AS THE PARAMETER FOR THE REQUEST
            id: req.params.id
        },
        // INCLUDE THE POSTS THE USER HAS CREATED, THE POSTS THE USER HAS COMMENTED ON, AND THE POSTS THE USER HAS UPVOTED
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                // IF NO USER IS FOUND, RETURN AN ERROR
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            // OTHERWISE, RETURN THE DATA FOR THE REQUESTED USER
            res.json(dbUserData);
        })
        .catch(err => {
            // IF THERE IS A SERVER ERROR, RETURN THAT ERROR
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /API/USERS -- ADD A NEW USER
router.post('/', (req, res) => {
    // CREATE METHOD
    // EXPECTS AN OBJECT IN THE FORM {USERNAME: 'LERNANTINO', EMAIL: 'LERNANTINO@GMAIL.COM', PASSWORD: 'PASSWORD1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        // SEND THE USER DATA BACK TO THE CLIENT AS CONFIRMATION AND SAVE THE SESSION
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
        // IF THERE IS A SERVER ERROR, RETURN THAT ERROR
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /API/USERS/LOGIN -- LOGIN ROUTE FOR A USER
router.post('/login', (req, res) => {
    // FINDONE METHOD BY EMAIL TO LOOK FOR AN EXISTING USER IN THE DATABASE WITH THE EMAIL ADDRESS ENTERED
    // EXPECTS {EMAIL: 'LERNANTINO@GMAIL.COM', PASSWORD: 'PASSWORD1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        // IF THE EMAIL IS NOT FOUND, RETURN AN ERROR
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
        // OTHERWISE, VERIFY THE USER.
        // CALL THE INSTANCE METHOD AS DEFINED IN THE USER MODEL
        const validPassword = dbUserData.checkPassword(req.body.password);
        // IF THE PASSWORD IS INVALID (METHOD RETURNS FALSE), RETURN AN ERROR
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        // OTHERWISE, SAVE THE SESSION, AND RETURN THE USER OBJECT AND A SUCCESS MESSAGE
        req.session.save(() => {
            // DECLARE SESSION VARIABLES
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// POST /API/USERS/LOGOUT -- LOG OUT AN EXISTING USER
router.post('/logout', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            // 204 STATUS IS THAT A REQUEST HAS SUCCEEDED, BUT CLIENT DOES NOT NEED TO GO TO A DIFFERENT PAGE
            // (200 INDICATES SUCCESS AND THAT A NEWLY UPDATED PAGE SHOULD BE LOADED, 201 IS FOR A RESOURCE BEING CREATED)
            res.status(204).end();
        });
    } else {
        // IF THERE IS NO SESSION, THEN THE LOGOUT REQUEST WILL SEND BACK A NO RESOURCE FOUND STATUS
        res.status(404).end();
    }
})

// PUT /API/USERS/1 -- UPDATE AN EXISTING USER
router.put('/:id', withAuth, (req, res) => {
    // UPDATE METHOD
    // EXPECTS {USERNAME: 'LERNANTINO', EMAIL: 'LERNANTINO@GMAIL.COM', PASSWORD: 'PASSWORD1234'}

    // IF REQ.BODY HAS EXACT KEY/VALUE PAIRS TO MATCH THE MODEL, 
    // YOU CAN JUST USE `REQ.BODY` INSTEAD OF CALLING OUT EACH PROPERTY,
    // ALLOWING FOR UPDATING ONLY KEY/VALUE PAIRS THAT ARE PASSED THROUGH
    User.update(req.body, {
        // SINCE THERE IS A HOOK TO HASH ONLY THE PASSWORD, THE OPTION IS NOTED HERE
        individualHooks: true,
        // USE THE ID AS THE PARAMETER FOR THE INDIVIDUAL USER TO BE UPDATED
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

// DELETE /API/USERS/1 -- DELETE AN EXISTING USER
router.delete('/:id', withAuth, (req, res) => {
    // DESTROY METHOD
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;