const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

// /api/comments/:pizaId/:commentId
router.route('/:pizzaId/:commentId').delete(removeComment);

// /api/comments/:id
router.route('/:id').post(addComment);

module.exports = router;