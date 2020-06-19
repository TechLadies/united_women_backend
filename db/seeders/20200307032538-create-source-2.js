'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
        "Sources",
        [
          {
            name: "Simply Giving",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Give Asia",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Global Giving",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        {}
      );
    },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
