'use strict'
module.exports = (sequelize, DataTypes) => {
  const donation = sequelize.define(
    'donation',
    {
      amount: DataTypes.INTEGER,
      campaignId: DataTypes.INTEGER,
      sourceId: DataTypes.INTEGER,
      donationDate: DataTypes.DATE,
      donorId: DataTypes.INTEGER
    },
    {}
  )
  donation.associate = function (models) {
    // associations can be defined here
  }
  return donation
}
