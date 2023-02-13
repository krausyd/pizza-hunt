const { Pizza, Comment } = require('../models');

const commentController = {
    //add comment to Pizza
    addComment({ params, body }, res) {
        Comment.create(body).then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                { _id: params.id },
                { $push: { comments: _id } },
                { new: true },
            );
        }).then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
            return;
        });
    },

    //remove Comment
    async removeComment({ params }, res) {
        try {
            const deletedComment = await Comment.findOneAndDelete({ _id: params.commentId });

            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id!' });
            }
            console.log(deletedComment);
            const dbPizzaData = await Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
                { new: true },
            );
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            return res.json(dbPizzaData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
            return;
        };
    },
};

module.exports = commentController;