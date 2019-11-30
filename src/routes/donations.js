const express = require("express");
const router = express.Router();
const db = require("../models/index");
const pagination = require("../middlewares/pagination");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const stringify = require("csv-stringify");

/* GET Donation Records */

async function fetchDonations(query, offset=null, limit=null) {
  const {
    dateStart,
    dateEnd,
    campaign,
    source,
    donorType
  } = query;

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
      where: { name: { [Op.in]: source.split(",") } },
    });
  }

  if (donorType) {
    include.push({
      model: db.Donor,
      where: { id: { [Op.not]: null } },
      include: [
        {
          model: db.DonorType,
          where: { donorType: { [Op.in]: donorType.split(",") } },
          as: 'donorType'
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

  let donationParams = {
    include: include,
    where: where
  }

  if (limit) {
    donationParams.limit = limit;
  }

  if (offset) {
    donationParams.offset = offset;
  }

  return db.Donation.findAll(donationParams);
}

router.get("", pagination, async function(req, res, next) {
  let offset = req.customParams.offset;
  let limit = req.customParams.limit;

  try {
    const donations = await fetchDonations(req.query, offset, limit);  

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

router.get("/download", async function(req, res, next) {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="' + "download-" + Date.now() + '.csv"'
  );
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Pragma", "no-cache");

  try {
    const donations = await fetchDonations(req.query)
    const promises = donations.map(async x=>{
      let donation = x.toJSON();
      delete donation.createdAt;
      delete donation.updatedAt;
      delete donation.campaignId;
      delete donation.sourceId;
      donation.campaign = (await x.getCampaign()).type;
      donation.source = (await x.getSource()).name;
      donation.donorName = (await x.getDonor()).name;
      donation.donationDate = donation.donationDate.toDateString();
      return donation;
    })
    const donationsJSON = await Promise.all(promises);
    stringify(donationsJSON, { header: true }).pipe(res);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }  
})

module.exports = router;
