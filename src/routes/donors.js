const express = require('express')
const router = express.Router()
const debug = require('debug')('app:users')
const db = require('../models/index')
const pagination = require('../middlewares/pagination')
/* GET donor info */

router.get('', pagination, async function (req, res, next) {
  let offset = req.customParams.offset
  let limit = req.customParams.limit

  try {
    const donors = await db.Donor.findAll({
      limit: limit,
      offset: offset
    })
    res.json({
      data: donors,
      perPage: limit,
      offset: offset
    })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.get('/:id', async function (req, res, next) {
  try {
    const donor = await db.Donor.findOne({
      where: {
        id: req.params.id
      },
      include: [{
          model: db.DonorFrequency,
          attributes: ['id', 'donorFrequency'],
          as: 'donorFrequency'
        },
        {
          model: db.Salutation,
          attributes: ['id', 'salutation'],
          as: 'salutation'
        },
        {
          model: db.DonorType,
          attributes: ['id', 'donorType'],
          as: 'donorType'
        }
      ]
    })
    res.json(donor)
  } catch (err) {
    res.status(500).json(err)
  }
})

/* GET donor's donations history
   Sample: /donors/1/donations?page=3&perPage=12
*/

router.get('/:id/donations', pagination, async function (req, res, next) {
  let offset = req.customParams.offset
  let limit = req.customParams.limit

  try {
    const donations = await db.Donation.findAll({
      where: {
        donorId: req.params.id
      },
      limit: limit,
      offset: offset
    })
    res.json({
      data: donations,
      perPage: limit,
      offset: offset
    })
  } catch (err) {
    res.status(500).json(err)
  }

})

router.get("/download", async function(req, res, next) {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="' + "download-" + Date.now() + '.csv"'
  );
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Pragma", "no-cache");

  try {
    const donorDetails = await fetchDonorsDetails(req.query)
    const promises = donorDetails.map(x=>{
      let donorDetail = x.toJSON();

      console.log(donorDetail)
      /*return {
        id,
        donationDate: donation.donationDate.toDateString(),
        campaign: donation.Campaign.type,
        source: donation.Source.name,
        donorName: donorDetail.name,
        amount
      }*/
    })
    const donorDetailsJSON = await Promise.all(promises);
    stringify(donorDetailsJSON, { header: true }).pipe(res);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }  
})

module.exports = router