'use strict'
module.exports = (sequelize, DataTypes) => {
  const campaign = sequelize.define(
    'campaign',
    {
      type: DataTypes.STRING,
      dateStart: DataTypes.DATE,
      dateEnd: DataTypes.DATE
    },
    {}
  )
  campaign.associate = function (models) {
    // associations can be defined here
  }
  return campaign
}
