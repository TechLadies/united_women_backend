"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "DonorFrequencies",
      [
        {
          donorFrequency: "Recurring",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          donorFrequency: "One-Time",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("DonorFrequencies", null, {});
  }
};
