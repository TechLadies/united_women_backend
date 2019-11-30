const express = require("express");
const router = express.Router();
const db = require("../models/index");
const pagination = require("../middlewares/pagination");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

/* GET Donation Records */

router.get("", pagination, async function(req, res, next) {
  let offset = req.customParams.offset;
  let limit = req.customParams.limit;

  const {
    dateStart,
    dateEnd,
    campaign,
    source,
    donorType
  } = req.query;

  let include = [];
  let where = {};

  if (campaign) {
    include.push({
      model: db.Campaign,
      where: { type: { [Op.in]: campaign.split(",") } }
    });
  }

  if (source) {
    include.push({
      model: db.Source,
      where: { name: { [Op.in]: source.split(",") } }
    });
  }

  if (donorType) {
    include.push({
      model: db.Donor,
      where: { id: { [Op.not]: null } },
      include: [
        {
          model: db.DonorType,
          where: { donorType: { [Op.in]: donorType.split(",") } }
        }
      ]
    });
  }

  if (dateStart) {
    where.donationDate = where.donationDate || {}
    where.donationDate[Op.gt] = new Date(dateStart);
  }

  if (dateEnd) {
    where.donationDate = where.donationDate || {}
    where.donationDate[Op.lt] = new Date(dateEnd);
  }

  try {
    const donations = await db.Donation.findAll({
      include: include,
      where: where,
      limit: limit,
      offset: offset
    });

    res.json({
      data: donations,
      perPage: limit,
      offset: offset
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
