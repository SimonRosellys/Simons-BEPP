const db = require("../db/connection");

exports.fetchTopicsMod = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticleMod = (article_id) => {
  // console.log(typeof article_id);

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((article) => {
      // console.log(article.rows);
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return article.rows;
    });
};
