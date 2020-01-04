const express = require('express')
const router = express.Router()
const debug = require('debug')('app:users')
const db = require('../models/index')
const pagination = require('../middlewares/pagination')
const Sequelize = require('sequelize')

/* Change aggregated user information to what should be displayed on client */
function parseAggregatedUser ({ dataValues: { Donor: { dataValues: { ...donor } }, ...donationInfo } }) {
  const parsedDonationInfo = {
    ...donationInfo,
    campaignIds: JSON.parse(`[${donationInfo.campaignIds}]`),
    sourceIds: JSON.parse(`[${donationInfo.sourceIds}]`)
  }
  return Object.assign({}, donor, { parsedDonationInfo })
}

/* GET donor info */
router.get('', pagination, async function (req, res) {
  const offset = req.customParams.offset
  const limit = req.customParams.limit

  try {
    // const aggUsers = await db.Donation.findAll({
    //   attributes: [
    //     'donorId',
    //     [Sequelize.fn('sum', Sequelize.col('amount')), 'totalAmount'],
    //     [Sequelize.fn('min', Sequelize.col('donationDate')), 'startedAt'],
    //     [Sequelize.literal("STRING_AGG(DISTINCT \"Donation\".\"campaignId\"::character varying,',')"), 'campaignIds'],
    //     [Sequelize.literal("STRING_AGG(DISTINCT \"Donation\".\"sourceId\"::character varying,',')"), 'sourceIds']
    //   ],
    //   include: [{
    //     model: db.Donor,
    //     where: {
    //       donorFrequencyId: 1
    //     }
    //   }],
    //   group: ['donorId', '"Donor".id'],
    //   limit: limit,
    //   offset: offset
    // })

    // const aggUsers = await db.Donor.findAll({
    //   include: [{
    //     model: db.Donation,
    //     as: 'Donation',
    //     attributes: [
    //       'donorId',
    //       [Sequelize.fn('sum', Sequelize.col('amount')), 'totalAmount'],
    //       [Sequelize.fn('min', Sequelize.col('donationDate')), 'startedAt'],
    //       [Sequelize.literal("STRING_AGG(DISTINCT \"Donation\".\"campaignId\"::character varying,',')"), 'campaignIds'],
    //       [Sequelize.literal("STRING_AGG(DISTINCT \"Donation\".\"sourceId\"::character varying,',')"), 'sourceIds']
    //     ]
    //   }],
    //   group: ['"Donation"."donorId"', '"Donor".id'],
    //   limit: limit,
    //   offset: offset
    // })

    const aggResults = await db.Donor.sequelize.query('SELECT "Donor".id, MIN("Donor".name) as "name", MIN("Donor".identifier) as "identifier", sum("Donations"."amount") AS "totalAmount", MIN("Donations"."donationDate") AS "startedAt", STRING_AGG(DISTINCT "Donations"."campaignId"::character varying,\',\') AS "campaignIds", STRING_AGG(DISTINCT "Donations"."sourceId"::character varying,\',\') AS "sourceIds" FROM "Donors" AS "Donor" LEFT OUTER JOIN "Donations" ON "Donor".id = "Donations"."donorId" GROUP BY "Donor".id LIMIT 10 OFFSET 0')
    const aggUsers = aggResults.length > 0 ? aggResults[0] : []

    res.json({
      data: aggUsers,
      perPage: limit,
      offset: offset
    })
  } catch (err) {
    console.log(err)
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

module.exports = router