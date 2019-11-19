"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "ContactModes",
      [
        {
          contactMode: "Email",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          contactMode: "Phone",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("ContactModes", null, {});
  }
};
