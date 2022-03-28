const db = require("../db/connection");
const { getTopicsMod } = require("../models/models");

exports.getTopicsCon = (req, res, next) => {
  getTopicsMod().then((topics) => {
    // console.log(topics, "<----- topics in controller");
    res.status(200).send(topics);
  });

  //    maybe use .catch(next); ????
};
