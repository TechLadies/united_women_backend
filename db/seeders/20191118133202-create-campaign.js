"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Campaigns",
      [
        {
          type: "STEM",
          dateStart: new Date(2018, 1, 23),
          dateEnd: new Date(2019, 6, 10),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          type: "Anti-Violence",
          dateStart: new Date(2018, 3, 24),
          dateEnd: new Date(2019, 9, 20),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Campaigns", null, {});
  }
};
