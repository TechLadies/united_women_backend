"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Sources",
      [
        {
          name: "Benevity",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Paypal",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Giving.sg",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Sources", null, {});
  }
};
