'use strict'
module.exports = (sequelize, DataTypes) => {
  const Salutation = sequelize.define(
    'Salutation',
    {
      Salutation: DataTypes.STRING
    },
    {}
  )
  Salutation.associate = function (models) {
    // associations can be defined here
  }
  return Salutation
}
