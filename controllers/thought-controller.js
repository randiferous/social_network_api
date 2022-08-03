const { Thought, User } = require('../models');

const thoughtController = {
    addThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: _id } },
                {new: true }
            );
        })
        .then(userData => {
            if(!userData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(userData);
        })
        .catch(err => res.json(err));
    },

    getAllThoughts(req, res) {
        Thought.find({})
        .then(thoughtData => res.json(thoughtData))
        .catch(err => {
            res.sendStatus(400);
        });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(thoughtData => res.json(thoughtData))
        .catch(err => {
            res.sendStatus(400);
        });
    }
}

module.exports = thoughtController;