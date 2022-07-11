const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/backend-errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Что-то пошло не так.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Что-то пошло не так.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send({ message: 'Карточка успешно удалена!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный формат id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Что-то пошло не так.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send({ message: 'Лайк поставлен!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный формат id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Что-то пошло не так.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send({ message: 'Лайк успешно снят!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный формат id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Что-то пошло не так.' });
    });
};
