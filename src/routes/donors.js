const express = require('express')
const router = express.Router()
const debug = require('debug')('app:users')
const db = require('../models/index')
const pagination = require('../middlewares/pagination')

function mapDateToObj (obj, key, val) {
  if (!isNaN(val)) {
    obj[key] = new Date(parseInt(val))
  }
}

function mapIntArrToObj (obj, key, val) {
  if (typeof val === 'object' && val.length >= 0) {
    const intArr = val.filter(i => !isNaN(i)).map(i => parseInt(i))
    if (intArr.length > 0) {
      obj[key] = intArr
    }
  }
}

// Generate a subquery template for values
// if "id" is "campaign" and "num" is 2
// return $campaign_0, $campaign_1
function getSubqueryBindTemplate (id, num) {
  const arr = []
  for (let i = 0; i < num; i++) {
    arr.push(`$${id}_${i}`)
  }

  return `${arr.join(', ')}`
}

function searchParamsToQuerySubstring (searchParams) {
  const queryArr = []
  const bindValues = {}

  if (searchParams.startAt && searchParams.endAt) {
    queryArr.push('"Donations"."donationDate" >= $startAt AND "Donations"."donationDate" <= $endAt')
    Object.assign(bindValues, {
      startAt: searchParams.startAt,
      endAt: searchParams.endAt
    })
  }

  if (searchParams.campaignIds && searchParams.campaignIds.length > 0) {
    const bindTemplate = getSubqueryBindTemplate('campaign', searchParams.campaignIds.length)
    queryArr.push(`"Donations"."campaignId" IN (${bindTemplate})`)
    searchParams.campaignIds.forEach((campaignId, idx) => {
      bindValues[`campaign_${idx}`] = campaignId
    })
  }

  if (searchParams.sourceIds && searchParams.sourceIds.length > 0) {
    const bindTemplate = getSubqueryBindTemplate('source', searchParams.sourceIds.length)
    queryArr.push(`"Donations"."sourceId" IN (${bindTemplate})`)
    searchParams.sourceIds.forEach((sourceId, idx) => {
      bindValues[`source_${idx}`] = sourceId
    })
  }

  if (searchParams.entityIds && searchParams.entityIds.length > 0) {
    const bindTemplate = getSubqueryBindTemplate('entity', searchParams.entityIds.length)
    queryArr.push(`"Donor"."donorTypeId" IN (${bindTemplate})`)
    searchParams.entityIds.forEach((entityId, idx) => {
      bindValues[`entity_${idx}`] = entityId
    })
  }

  const querySubstr = queryArr.join(' AND ')

  return {
    bindValues,
    querySubstr
  }
}

function donorQuery (sequelize, bindValues, querySubstr) {
  let queryStr = 'SELECT "Donor".id, MIN("Donor".name) as "name", MIN("Donor".identifier) as "identifier", sum("Donations"."amount") AS "totalAmount", MIN("Donations"."donationDate") AS "startedAt", STRING_AGG(DISTINCT "Campaigns"."type",\' ,\') AS "campaignTypes", STRING_AGG(DISTINCT "Sources"."name",\' ,\') AS "sourceNames" FROM "Donors" AS "Donor" LEFT OUTER JOIN "Donations" ON "Donor".id = "Donations"."donorId" LEFT OUTER JOIN "Campaigns" ON "Campaigns"."id" = "Donations"."campaignId" LEFT OUTER JOIN "Sources" ON "Sources"."id" = "Donations"."sourceId" GROUP BY "Donor".id LIMIT 10 OFFSET 0'

  if (querySubstr !== '') {
    queryStr = `SELECT "Donor".id, MIN("Donor".name) as "name", MIN("Donor".identifier) as "identifier", sum("Donations"."amount") AS "totalAmount", MIN("Donations"."donationDate") AS "startedAt", STRING_AGG(DISTINCT "Campaigns"."type",\' ,\') AS "campaignTypes", STRING_AGG(DISTINCT "Sources"."name",\' ,\') AS "sourceNames" FROM "Donors" AS "Donor" LEFT OUTER JOIN "Donations" ON "Donor".id = "Donations"."donorId" LEFT OUTER JOIN "Campaigns" ON "Campaigns"."id" = "Donations"."campaignId" LEFT OUTER JOIN "Sources" ON "Sources"."id" = "Donations"."sourceId" WHERE ${querySubstr} GROUP BY "Donor".id LIMIT 10 OFFSET 0`
  }

  return sequelize.query(queryStr, {
    bind: bindValues,
    type: sequelize.QueryTypes.SELECT
  })
}

/* GET donor info */
router.get('', pagination, async function (req, res) {
  const offset = req.customParams.offset
  const limit = req.customParams.limit
  const { startAt, endAt, campaignIds, sourceIds, entityIds } = req.query

  const searchParams = {}
  mapDateToObj(searchParams, 'startAt', startAt)
  mapDateToObj(searchParams, 'endAt', endAt)
  mapIntArrToObj(searchParams, 'campaignIds', campaignIds)
  mapIntArrToObj(searchParams, 'sourceIds', sourceIds)
  mapIntArrToObj(searchParams, 'entityIds', entityIds)

  const { bindValues, querySubstr } = searchParamsToQuerySubstring(searchParams)

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

    const aggUsers = await donorQuery(db.Donor.sequelize, bindValues, querySubstr)

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