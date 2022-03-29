const db = require("../db/connection");
const { getTopicsMod } = require("../models/models");

exports.getTopicsCon = (req, res, next) => {
  getTopicsMod().then((topics) => {
    res.status(200).send(topics);
  });

  //    maybe use .catch(next); ????
};
