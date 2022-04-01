const res = require("express/lib/response");
const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.fetchTopicsMod = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticleMod = (article_id) => {
  return db
    .query(
      `
SELECT articles.*, COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE articles.article_id = $1
GROUP BY articles.article_id;
`,
      [article_id]
    )
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
        return Promise.reject({ status: 404, msg: "Invalid article ID" });
      }
      return article.rows[0];
    });
};

exports.fetchUsersMod = () => {
  return db.query(`SELECT * FROM users;`).then((users) => {
    let usernameArr = [];
    users.rows.forEach((user) => {
      usernameArr.push({ username: user.username });
    });
    return { users: usernameArr };
  });
};
