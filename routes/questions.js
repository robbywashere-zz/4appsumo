const models = require('../models');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  models.Question.findAll({
    include: [models.Answer],
  }).then((questions) => {
    res.render('admin', {
      title: 'Survey Admin',
      questions,
    });
  });
});


router.post('/create', (req, res) => {
  models.Question.create({
    text: req.body.text,
  }).then(() => {
    res.redirect('/admin/questions');
  });
});


router.get('/results', (req, res) => {
  models.Question.findAll({
    include: [models.Answer],
  }).then((questions) => {
    res.render('results', {
      title: 'Survey Admin',
      questions,
    });
  });
});


router.get('/:question_id/destroy', (req, res) => {
  models.Question.destroy({
    where: {
      id: req.params.question_id,
    },
  }).then(() => {
    res.redirect('/admin/questions');
  });
});

router.post('/:question_id/answers/create', (req, res) => {
  models.Answer.create({
    text: req.body.text,
    count: 0,
    QuestionId: req.params.question_id,
  }).then(() => {
    res.redirect('/admin/questions');
  });
});


router.get('/:question_id/answers/:answer_id/destroy', (req, res) => {
  models.Answer.destroy({
    where: {
      id: req.params.answer_id,
    },
  }).then(() => {
    res.redirect('/admin/questions');
  });
});


module.exports = router;
