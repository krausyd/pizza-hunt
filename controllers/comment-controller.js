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

    addReply({ params, body }, res) {
        console.log(body);
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true },
        ).then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No comment found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        }).catch(e => {
            console.log(e);
            res.status(500).json(e);
            return;
        });
    },

    removeReply({ params }, res) {
        console.log(params);
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true },
        ).then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No comment or reply found with that combination of ids!' });
                return;
            }
            res.json(dbPizzaData);
        }).catch(e => {
            console.log(e);
            res.status(500).json(e);
            return;
        });
    },
};

module.exports = commentController;