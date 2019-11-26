"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Salutations",
      [
        {
          salutation: "Mr",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          salutation: "Mrs",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          salutation: "Ms",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          salutation: "Miss",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          salutation: "Dr",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Salutations", null, {});
  }
};
