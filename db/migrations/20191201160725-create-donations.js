'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Donations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      donationDate: {
        type: Sequelize.DATE
      },
      donationAmount: {
        type: Sequelize.NUMERIC
      },
      sourceId: {
        type: Sequelize.INTEGER
      },
      intentId: {
        type: Sequelize.INTEGER
      },
      paymentTypeId: {
        type: Sequelize.INTEGER
      },
      donationType: {
        type: Sequelize.STRING
      },
      paymentRef: {
        type: Sequelize.STRING
      },
      taxDeductible: {
        type: Sequelize.BOOLEAN
      },
      remarks: {
        type: Sequelize.STRING
      },
      receiptNo: {
        type: Sequelize.STRING
      },
      void: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Donations');
  }
};