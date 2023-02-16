const router = require('express').Router();
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller');

// /api/comments/:pizaId/:commentId
router.route('/:pizzaId/:commentId').delete(removeComment).put(addReply);

// /api/comments/:id
router.route('/:id').post(addComment);

router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;