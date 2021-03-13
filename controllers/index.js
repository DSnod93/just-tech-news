// AN INDEX FILE TO GATHER THE ROUTES TO EXPORT TO THE SERVER
// DEPENDENCIES
// SERVER CONNECTION
const router = require('express').Router();
// API ROUTES FOLDER
const apiRoutes = require('./api');
// THE HANDLEBARS HOMEPAGE AND SINGLE PAGE ROUTES
const homeRoutes = require('./home-routes.js');
// THE HANDLEBARS DASHBOARD ROUTES
const dashboardRoutes = require('./dashboard-routes.js');

// DEFINE PATHS FOR THE HANDLEBARS HTML ROUTES
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

// DEFINE THE PATH FOR THE SERVER FOR THE API ROUTES
router.use('/api', apiRoutes);

// DEFINE A CATCH-ALL ROUTE FOR ANY RESOURCE THAT DOESN'T EXIST
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;