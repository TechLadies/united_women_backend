const express = require("express");
const router = express.Router();
const debug = require("debug")("app:users");
const db = require("../models/index");
const pagination = require("../middlewares/pagination");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const stringify = require("csv-stringify");

/* GET donor info with filters
   Sample: /donors?donorTypeId=1&dateStart=2019-11-01T16:00:00.000Z
 */
async function fetchDonors(query, offset = null, limit = null) {
  const {
    dateStart,
    dateEnd,
    donorTypeId,
    donorFrequencyId
  } = query;

  let include = [];
  let where = {};

  if (donorTypeId) {
    where.donorTypeId = donorTypeId;
  }

  if (donorFrequencyId) {
    where.donorFrequencyId = donorFrequencyId;
  }

  if (dateStart) {
    where.donationStart = where.donationStart || {}
    where.donationStart[Op.gt] = new Date(dateStart);
  }

  if (dateEnd) {
    where.donationStart = where.donationStart || {}
    where.donationStart[Op.lt] = new Date(dateEnd);
  }

  include.push({
    model: db.Donation,
    as: 'Donations',
    attributes: ['amount']
  });

  let donorParams = {
    include: include,
    where: where,
    order: [["donationStart", "DESC"]],
    includeIgnoreAttributes: false,
    attributes: [
      'id',
      'name',
      'email',
      'identifier',
      'donationStart',
      'donorTypeId',
      'donorFrequencyId',
      [Sequelize.fn('SUM', Sequelize.col('"Donations".amount')), 'total_amount']
    ],
    subQuery: false,
    group: ["Donor.id"]
  }

  if (limit) {
    donorParams.limit = limit;
  }

  if (offset) {
    donorParams.offset = offset;
  }

  return db.Donor.findAll(donorParams);

}

router.get("", pagination, async function (req, res, next) {
  let offset = req.customParams.offset;
  let limit = req.customParams.limit;

  try {
    const donors = await fetchDonors(req.query, offset, limit);

    res.json({
      data: donors,
      perPage: limit,
      offset: offset
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/count", async function (req, res, next) {
  try {
    const donors = await fetchDonors(req.query)
    res.json({
      count: donors.length
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/download", async function (req, res, next) {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="' + "download-" + Date.now() + '.csv"'
  );
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Pragma", "no-cache");

  try {
    const donors = await fetchDonors(req.query)
    const promises = donors.map(x => {
      let donor = x.toJSON();

      const { id, name, email, donorTypeId, donorFrequencyId, total_amount, donationStart } = donor

      let donorType = "";
      if (donorTypeId == 1) {
        donorType = "company"
      }
      if (donorTypeId == 2) {
        donorType = "individual"
      }

      let donorFrequency = "";
      if (donorFrequencyId == 1) {
        donorFrequency = "recurring"
      }
      if (donorFrequencyId == 2) {
        donorFrequency = "one-time"
      }

      return {
        id,
        name,
        email,
        donorType,
        donorFrequency,
        total_amount,
        donationStart: donationStart.toDateString()
      }
    })
    const donorsJSON = await Promise.all(promises);
    stringify(donorsJSON, { header: true }).pipe(res);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.get("/:id", async function (req, res, next) {
  try {
    const donor = await db.Donor.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.DonorFrequency,
          attributes: ["id", "donorFrequency"],
          as: "donorFrequency"
        },
        {
          model: db.Salutation,
          attributes: ["id", "salutation"],
          as: "salutation"
        },
        {
          model: db.DonorType,
          attributes: ["id", "donorType"],
          as: "donorType"
        },
        {
          model: db.ContactMode,
          attributes: ["id", "contactMode"],
          as: "contactMode"
        }
      ]
    });
    res.json(donor);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET donor's donations history
   Sample: /donors/1/donations?page=3&perPage=12
*/

router.get("/:id/donations", pagination, async function (req, res, next) {
  let offset = req.customParams.offset;
  let limit = req.customParams.limit;

  try {
    const donations = await db.Donation.findAll({
      where: {
        donorId: req.params.id
      },
      subQuery: true,
      include: [db.Campaign, db.Source],
      limit: limit,
      offset: offset,
      order: [["donationDate", "DESC"]]
    });
    res.json({
      data: donations,
      perPage: limit,
      offset: offset
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch("/:id", async function (req, res, next) {
  const donor = await db.Donor.findOne({ where: { id: req.params.id } });
  // Check if record exists in db
  if (donor) {
    try {
      for (let key in req.body) {
        donor[key] = req.body[key];
      }
      await donor.save();
      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  } else {
    res.status(400).json({ error: "Donor not found" });
  }
});

module.exports = router;
