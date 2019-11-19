"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("DonorTypes", [
      {
        donorType: "Individual",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        donorType: "Company",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("DonorTypes", null, {});
  }
};
