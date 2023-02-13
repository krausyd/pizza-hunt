const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes');

// add prefix /pizzas to routes created in pizza-routes.js
router.use('/pizzas', pizzaRoutes);

module.exports = router;