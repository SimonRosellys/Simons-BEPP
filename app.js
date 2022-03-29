const express = require("express");
const { getTopicsCon, getArticleCon } = require("./controllers/controllers");
const app = express();

app.use(express.json());
app.get("/api/topics", getTopicsCon);
app.get("/api/articles/:article_id", getArticleCon);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
