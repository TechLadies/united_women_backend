'use strict'
module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define(
    'Donation',
    {
      amount: DataTypes.INTEGER,
      campaignId: DataTypes.INTEGER,
      sourceId: DataTypes.INTEGER,
      donationDate: DataTypes.DATE,
      donorId: DataTypes.INTEGER
    },
    {}
  )
  Donation.associate = function (models) {
    Donation.belongsTo(models.Donor, {
      foreignKey: 'donorId'
    })
    Donation.belongsTo(models.Campaign, {
      foreignKey: 'campaignId'
    })
    Donation.belongsTo(models.Source, {
      foreignKey: 'sourceId'
    })
  }
  return Donation
}
