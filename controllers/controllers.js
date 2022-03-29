const db = require("../db/connection");
const { fetchTopicsMod, fetchArticleMod } = require("../models/models");

exports.getTopicsCon = (req, res, next) => {
  fetchTopicsMod().then((topics) => {
    res.status(200).send(topics);
  });
};

exports.getArticleCon = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleMod(article_id)
    .then((article) => {
      const specificArticle = {
        author: article.name,
        title: article.title,
        article_id: Number(article_id),
        body: article.body,
        topic: article.topic,
        created_at: article.created_at,
        votes: article.votes,
      };
      res.status(200).send(specificArticle);
    })
    .catch(next);
};
