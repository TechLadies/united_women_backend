"use strict";
module.exports = (sequelize, DataTypes) => {
  const Source = sequelize.define(
    "Source",
    {
      name: DataTypes.STRING
    },
    {}
  );
  Source.associate = function(models) {
    // associations can be defined here
  };

  Source.getSource = function(key) {
    return Source.findOne({
      name: key
    });
  };

  Source.getSourceId = function(key) {
    return Source.getSource(key).then(function(res) {
      return res.id;
    });
  };

  return Source;
};
