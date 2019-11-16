'use strict';
module.exports = (sequelize, DataTypes) => {
  const DonorType = sequelize.define('DonorType', {
    DonorType: DataTypes.STRING
  }, {});
  DonorType.associate = function(models) {
    // associations can be defined here
  };
  return DonorType;
};