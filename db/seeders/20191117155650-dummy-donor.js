"use strict";

const fs = require("fs");
const path = require("path");
let rawdata = fs.readFileSync(path.resolve(__dirname, "../MOCK_DONOR_DATA.json"));
let donors = JSON.parse(rawdata);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Donors", donors);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Donors", null, {});
  }
};
