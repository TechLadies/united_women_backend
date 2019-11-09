"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("donations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER
      },
      campaignId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Campaigns",
          key: "id"
        }
      },
      sourceId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Sources",
          key: "id"
        }
      },
      donationDate: {
        type: Sequelize.DATE
      },
      donorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Donors",
          key: "id"
        }
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
    return queryInterface.dropTable("donations");
  }
};
