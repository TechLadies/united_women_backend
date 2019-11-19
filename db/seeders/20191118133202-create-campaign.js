"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Campaigns",
      [
        {
          type: "STEM",
          dateStart: null,
          dateEnd: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          type: "Anti-Violence",
          dateStart: null,
          dateStart: null,
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
