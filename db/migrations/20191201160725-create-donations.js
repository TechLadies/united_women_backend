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
        type: Sequelize.DATE,
        allowNull:false
      },
      donationAmount: {
        type: Sequelize.NUMERIC,
        allowNull:false
      },
      sourceId: {
        allowNull:false,
        foreignKey:true,
        type: Sequelize.INTEGER,
        references: {                 // Add this for foreign key constraints
          model: 'Sources',
          key: 'id'
        },
        onUpdate: 'cascade'
      },
      intentId: {
        allowNull: true,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {                 // Add this for foreign key constraints
          model: 'Intents',
          key: 'id'
        },
        onUpdate: 'cascade'
      },
      paymentTypeId: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {                 // Add this for foreign key constraints
          model: 'PaymentTypes',
          key: 'id'
        },
        onUpdate: 'cascade'
        
      },
      donationType: {
        allowNull:false,
        type: Sequelize.STRING
      },
      paymentRef: {
        allowNull:false,
        type: Sequelize.STRING
      },
      taxDeductible: {
        allowNull:false,
        type: Sequelize.BOOLEAN
      },
      remarks: {
        allowNull: false,
        type: Sequelize.STRING
      },
      receiptNo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      void: {
        allowNull: false,
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