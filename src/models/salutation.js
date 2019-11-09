'use strict'
module.exports = (sequelize, DataTypes) => {
  const salutation = sequelize.define(
    'salutation',
    {
      salutation: DataTypes.STRING
    },
    {}
  )
  salutation.associate = function (models) {
    // associations can be defined here
  }
  return salutation
}
