const Card = require('../models/card');

module.exports.getCards = (req, res) => {
    Card.find({})
    .then(cards => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({name, link, owner: req.user._id })
    .then(card => res.status(201).send({ data: card }))
    .catch((err) => {
      if(err.name === "ValidationError") {
        return res.status(400).send({ message: 'Переданы некорректные данные!' })
      }
      res.status(500).send({ message: 'Что-то пошло не так.' })
    });
    
  };

module.exports.deleteCard = (req, res) => {
    Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if(!card) {
        return res.status(404).send({ message: 'Карточка не найдена' })
      }
      res.status(201).send({ message: "Карточка успешно удалена!" });
    })
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так.' }));
};

module.exports.likeCard = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        { new: true },
      )
    .then(res.status(201).send({ message: "Лайк поставлен!"}))
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так.' }));
};

  
  module.exports.dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
        { new: true },
      )
      .then(res.status(201).send({ message: "Лайк убран!"}))
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так.' }));
};