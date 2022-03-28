const express = require("express");
const { getTopicsCon } = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopicsCon);

// app.use((err, req, res, next) => {
//   if (err.status && err.msg) {
//     res.status(err.status).send({ msg: err.msg });
//   } else {
//     next(err);
//   }
// });

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
