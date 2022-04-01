const db = require("../db/connection");
const {
  fetchTopicsMod,
  fetchArticleMod,
  updateArticleMod,
  fetchUsersMod,
  fetchAllArticlesMod,
} = require("../models/models");

exports.getTopicsCon = (req, res, next) => {
  fetchTopicsMod().then((topics) => {
    res.status(200).send(topics);
  });
};

exports.getArticleCon = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleMod(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleCon = (req, res, next) => {
  const { article_id } = req.params;
  const { votes_inc } = req.body;

  updateArticleMod(article_id, votes_inc)
    .then((updatedArticle) => {
      res.send({ updatedArticle });
    })
    .catch(next);
};

exports.getUsersCon = (req, res, next) => {
  fetchUsersMod().then((users) => {
    res.status(200).send(users);
  });
};

exports.getAllArticlesCon = (req, res, next) => {
  fetchAllArticlesMod().then((articles) => {
    res.status(200).send(articles);
  });
};
