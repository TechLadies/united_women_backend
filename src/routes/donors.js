const express = require('express')
const router = express.Router()
const debug = require('debug')('app:users')
const db = require('../models/index')
const pagination = require('../middlewares/pagination')
/* GET donor info */

router.get('/:id', async function (req, res, next) {
  try {
    const donor = await db.Donor.findOne({ where: { id: req.params.id }})
    console.log("step 1")
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
      where: { donorId: req.params.id },
      limit: limit,
      offset: offset
    })
    res.json({
      data: donations,
      perPage: limit,
      offset: offset
    })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }

})

module.exports = router
