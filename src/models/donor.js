'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donor = sequelize.define('Donor', {
    name: DataTypes.STRING,
    identifier: DataTypes.STRING,
    salutationId: DataTypes.INTEGER,
    contactNo: DataTypes.STRING,
    email: DataTypes.STRING,
    donorTypeId: DataTypes.INTEGER,
    donorFrequencyId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    donationStart: DataTypes.DATE,
    preferredContactMode: DataTypes.STRING,
    doNotContact: DataTypes.BOOLEAN
  }, {});
  Donor.associate = function(models) {
    Donor.belongsTo(models.DonorType, {
      foreignKey: 'donorTypeId'
    })
    // Donor.hasMany(models.Donation, {
    //   foreignKey: 'donorId'
    // })
  };
  return Donor;
};