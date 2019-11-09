'use strict';
module.exports = (sequelize, DataTypes) => {
  const donorType = sequelize.define('donorType', {
    donorType: DataTypes.STRING
  }, {});
  donorType.associate = function(models) {
    // associations can be defined here
  };
  return donorType;
};