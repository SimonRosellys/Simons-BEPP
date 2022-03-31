const db = require("../db/connection");

exports.fetchTopicsMod = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticleMod = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return article.rows;
    });
};

exports.updateArticleMod = (article_id, votes_inc) => {
  return db
    .query(
      `
    UPDATE articles 
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
      [votes_inc, article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "bad request" });
      }
      return article.rows;
    });
};
