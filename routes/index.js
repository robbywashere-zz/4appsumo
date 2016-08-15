const models = require('../models');
const express = require('express');

const router = express.Router();

router.get('/reset', (req, res) => {
  req.session = null;
  res.redirect('/');
});

router.get('/', (req, res) => {
  models.Question.findAll({
    include: [models.Answer],
    where: {
      id: {
        $notIn: req.session.answered || [-1],
      },
    },
  }).then((questions) => {
    res.render('index', {
      title: 'Survey',
      question: questions[0],
    });
  });
});

router.post('/question/:question_id/answer', (req, res) => {
  if (!req.body.answer || !req.params.question_id) {
    res.redirect('/');
  }

  req.session.answered = (req.session.answered || []).concat(req.params.question_id);

  models.Answer
    .build({ id: parseInt(req.body.answer, 10) }, { isNewRecord: false })
    .increment('count')
    .then(() => {
      res.redirect('/');
    });
});

module.exports = router;
