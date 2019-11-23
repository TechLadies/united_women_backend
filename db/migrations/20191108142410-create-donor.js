"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Donors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      identifier: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salutationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Salutations",
          key: "id"
        }
      },
      contactNo: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      donorTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "DonorTypes",
          key: "id"
        },
        allowNull: false
      },
      donorFrequencyId: {
        type: Sequelize.INTEGER,
        references: {
          model: "DonorFrequencies",
          key: "id"
        },
        allowNull: false
      },
      address: {
        type: Sequelize.STRING
      },
      donationStart: {
        type: Sequelize.DATE,
        allowNull: false
      },
      preferredContactMode: {
        type: Sequelize.INTEGER,
        references: {
          model: "ContactModes",
          key: "id"
        },
        allowNull: false
      },
      doNotContact: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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
    return queryInterface.dropTable("Donors");
  }
};
