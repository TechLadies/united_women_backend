"use strict";

const fs = require("fs");
const path = require("path");
let rawdata = fs.readFileSync(
  path.resolve(__dirname, "../MOCK_DONATION_DATA.json")
);
let donations = JSON.parse(rawdata);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Donations", donations);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Donations", null, {});
  }
};
