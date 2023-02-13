const { Comment, Pizza } = require('../models');

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
            });
    },

    //remove Comment
    removeComment({ params, body }, res) {
        Comment.findOneAndDelete({ _id: params.commentId }).then(deletedComment => {
            if (!deletedComment) {
                res.status(404).json({ message: 'No comment with this id!' });
                return;
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
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
        });
    },
};

module.exports = commentController;