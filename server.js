// SERVER FOR THE JUST TECH NEWS PROJECT
// DEPENDENCIES
// PATH MODULE
const path = require('path');
// DOTENV FILE FOR SENSITIVE CONFIGURATION INFORMATION
require('dotenv').config();
// EXPRESS.JS SERVER
const express = require('express');
// ALL ROUTES AS DEFINED IN THE CONTROLLERS FOLDER
const routes = require('./controllers/');
// SEQUELIZE CONNECTION TO THE DATABASE
const sequelize = require('./config/connection');
// HANDLEBARS TEMPLATE ENGINE FOR FRONT-END
const exphbs = require('express-handlebars');
// EXPRESS SESSION TO HANDLE SESSION COOKIES
const session = require('express-session')
// SEQUELIZE STORE TO SAVE THE SESSION SO THE USER CAN REMAIN LOGGED IN
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// HANDLEBARS HELPERS
const helpers = require('./utils/helpers');

// INITIALIZE HANDLEBARS FOR THE HTML TEMPLATES
const hbs = exphbs.create({});

// INITIALIZE SESSION WITH OPTIONS PER BEST PRACTICES.  
//THE SECRET IS DEFINED IN THE .ENV FILE SO IT IS KEPT SECURE, ALONG WITH THE MYSQL LOGIN INFORMATION USED IN CONFIG/CONNECTION
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};
// INITIALIZE THE SERVER
const app = express();
// DEFINE THE PORT FOR THE SERVER
const PORT = process.env.PORT || 3001;
// GIVE THE SERVER A PATH TO THE PUBLIC DIRECTORY FOR STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
// SET HANDLEBARS AS THE TEMPLATE ENGINE FOR THE SERVER
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// HAVE EXPRESS PARSE JSON AND STRING DATA
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// TELL THE APP TO USE EXPRESS SESSION FOR THE SESSION HANDLING
app.use(session(sess));
// GIVE THE SERVER THE PATH TO THE ROUTES
app.use(routes);
// TURN ON CONNECTION TO DB AND THEN TO THE SERVER
// FORCE: TRUE TO RESET THE DATABASE AND CLEAR ALL VALUES, UPDATING ANY NEW RELATIONSHIPS
// FORCE: FALSE TO MAINTAIN DATA - AKA NORMAL OPERATION
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});