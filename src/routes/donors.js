const express = require("express");
const router = express.Router();
const debug = require("debug")("app:users");
const db = require("../models/index");
const pagination = require("../middlewares/pagination");
/* GET donor info */

router.get("", pagination, async function(req, res, next) {
  let offset = req.customParams.offset;
  let limit = req.customParams.limit;

  try {
    const donors = await db.Donor.findAll({
      limit: limit,
      offset: offset
    });
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

router.get("/:id", async function(req, res, next) {
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

router.get("/:id/donations", pagination, async function(req, res, next) {
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
      offset: offset
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

router.patch("/:id", async function(req, res, next) {
  const donor = await db.Donor.findOne({ where: { id: req.params.id } });

  // Check if record exists in db
  if (donor) {
    try {
      await donor.update(
        { name: req.body.name },
        { identifier: req.body.identifier },
        { contactNo: req.body.contactNo },
        { salutationId: req.body.salutationId },
        { email: req.body.email },
        { donorTypeId: req.body.donorTypeId },
        { donorFrequencyId: req.body.donorFrequencyId },
        { address: req.body.address },
        { preferredContactMode: req.body.preferredContactMode },
        { doNotContact: req.body.doNotContact }
      );
      return res.sendStatus(204);
    } catch (err) {
      console.err(err);
      res.sendStatus(500);
    }
  } else {
    res.status(400).json({ error: "Donor not found" });
  }
});

module.exports = router;
