const express = require("express");
const {
  getTopicsCon,
  getArticleCon,
  patchArticleCon,
  getUsersCon,
  getAllArticlesCon,
  getCommentsCon,
} = require("./controllers/controllers");
const app = express();

app.use(express.json());
app.get("/api/topics", getTopicsCon);
app.get("/api/articles/:article_id", getArticleCon);
app.get("/api/articles/:article_id/comments", getCommentsCon);
app.get("/api/articles", getAllArticlesCon);
app.patch("/api/articles/:article_id", patchArticleCon);
app.get("/api/users", getUsersCon);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const invalidRequestCodes = ["22P02"];
  if (invalidRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
