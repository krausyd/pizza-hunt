const router = require('express').Router();
const { 
    getAllPizzas,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza,
 } = require('../../controllers/pizza-controller');

 
// setup get and post /api/pizzas
router.route('/').get(getAllPizzas).post(createPizza);

// setup get one, put one, and delete one by id /api/pizzas/:id
router.route('/:id').get(getPizzaById).put(updatePizza).delete(deletePizza);

module.exports = router;