const express = require('express')
const router = express.Router()
const db = require('../models/index')
const pagination = require('../middlewares/pagination')

/* GET Donation Records */

router.get('', pagination, async function (req, res, next) {
    let offset = req.customParams.offset
    let limit = req.customParams.limit
  
    try {
      const donations = await db.Donation.findAll({
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
  