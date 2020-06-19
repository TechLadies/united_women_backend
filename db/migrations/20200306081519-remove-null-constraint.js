"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Donors", "donorTypeId", {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      queryInterface.changeColumn("Donors", "preferredContactMode", {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      queryInterface.changeColumn("Donors", "doNotContact", {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      queryInterface.changeColumn("Donations", "campaignId", {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
