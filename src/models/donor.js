'use strict';
module.exports = (sequelize, DataTypes) => {
  const donor = sequelize.define('donor', {
    name: DataTypes.STRING,
    identifier: DataTypes.STRING,
    salutationId: DataTypes.INTEGER,
    contactNo: DataTypes.STRING,
    email: DataTypes.STRING,
    donorTypeId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    donationStart: DataTypes.DATE
  }, {});
  donor.associate = function(models) {
    // associations can be defined here
  };
  return donor;
};