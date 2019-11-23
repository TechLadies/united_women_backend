"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Campaigns",
      [
        {
          type: "STEM",
          dateStart: new Date(2019, 01, 11),
          dateEnd: new Date(2019, 02, 11),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          type: "Anti-Violence",
          dateStart: new Date(2019, 02, 11),
          dateEnd: new Date(2019, 03, 11),
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
