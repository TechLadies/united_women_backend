'use strict'

const fs = require('fs')
const path = require('path')
const rawdata = fs.readFileSync(
  path.resolve(__dirname, '../MOCK_DONATION_DATA_2.json')
)
const donations = JSON.parse(rawdata)

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Donations', donations)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Donations', null, {})
  }
}
