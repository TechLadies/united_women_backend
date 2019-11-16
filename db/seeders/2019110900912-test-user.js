"use strict";

const { User } = require("../../src/models");

const ROLES = {
  ADMIN: 1,
  USER: 2
};

const users = [
  {
    username: "tan@uws.org.sg",
    passwordHash: "password123",
    userRoleId: ROLES.USER,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return User.bulkCreate(users, {
      individualHooks: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
