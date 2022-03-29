const db = require("../db/connection");

exports.fetchTopicsMod = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticleMod = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles JOIN users ON articles.author = users.username`
    )
    .then((article) => {
      if (article_id > article.rows.length) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return article.rows[article_id - 1];
    });
};
