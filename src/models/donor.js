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
    doNotContact: DataTypes.BOOLEAN,
    company: DataTypes.STRING,
    comments: DataTypes.TEXT,
    total_amount: DataTypes.INTEGER
  }, {});
  Donor.associate = function(models) {
    // associations can be defined here
    Donor.hasOne(models.Salutation, {
      sourceKey: 'salutationId',
      foreignKey: 'id',
      as: 'salutation'
    })
    Donor.hasOne(models.DonorFrequency, {
      sourceKey: 'donorFrequencyId',
      foreignKey: 'id',
      as: 'donorFrequency'
    })
    Donor.hasOne(models.DonorType, {
      sourceKey: 'donorTypeId',
      foreignKey: 'id',
      as: 'donorType'
    })
  };
  return Donor;
};