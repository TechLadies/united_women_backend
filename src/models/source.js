'use strict';
module.exports = (sequelize, DataTypes) => {
  const source = sequelize.define('source', {
    name: DataTypes.STRING
  }, {});
  source.associate = function(models) {
    // associations can be defined here
  };
  return source;
};