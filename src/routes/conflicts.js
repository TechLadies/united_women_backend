const express = require("express");
const router = express.Router();
const db = require("../models/index");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get("", async function(req, res, next) {
  let existing = await db.Donor.findAll({
    attributes: [
      "identifier",
      "name", 
      "email",
      Sequelize.fn("count", Sequelize.col("identifier"))
    ],
    group: ["identifier", "name", "email"],
    having: Sequelize.where(
      Sequelize.fn("count", Sequelize.col("identifier")),
      {
        [Op.gt]: 1
      }
    )
  });
  res.json({ existing });
});

module.exports = router;
