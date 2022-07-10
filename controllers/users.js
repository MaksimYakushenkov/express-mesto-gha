const User = require('../models/user');

module.exports.getUsers = (req, res) => {
    User.find({})
    .then(users => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так.' }));
};

module.exports.getUser = (req, res) => {
    User.findById(req.params.userId)
    .then((user) => {
        if(!user) {
            return res.status(404).send({ message: 'Пользователь не найден!' })
        }
        res.status(200).send({ data: user });
    })
    .catch((err) => {
        if(err.name === "ValidationError") {
            return res.status(400).send({ message: 'Переданы некорректные данные!' })
        }
        if (err === "CastError") {
            return res.status(400).send({ message: 'Невозможно прочитать id' })
        }
        res.status(500).send({ message: 'Что-то пошло не так.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({name, about, avatar })
    .then(user => res.status(201).send({ data: user }))
    .catch((err) => {
        if(err.name === "ValidationError") {
            return res.status(400).send({ message: 'Переданы некорректные данные!' })
        }
        res.status(500).send({ message: 'Что-то пошло не так.' });
    });
};

module.exports.updateUser = (req, res) => {
    const { name, about } = req.body;
    User.findByIdAndUpdate(req.user._id, { name, about })
    .then(user => res.send({ data: user }))
    .catch((err) => {
        if(err.name === "ValidationError") {
            return res.status(400).send({ message: 'Переданы некорректные данные!' })
        }
        res.status(500).send({ message: 'Что-то пошло не так.' });
    });
}

module.exports.updateAvatar = (req, res) => {
    const { avatar } = req.body;
    User.findByIdAndUpdate(req.user._id, { avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
        if(err.name === "ValidationError") {
            return res.status(400).send({ message: 'Переданы некорректные данные!' })
        }
        res.status(500).send({ message: 'Что-то пошло не так.' });
    });
}


