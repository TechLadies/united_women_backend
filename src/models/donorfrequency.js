"use strict";
module.exports = (sequelize, DataTypes) => {
  const DonorFrequency = sequelize.define(
    "DonorFrequency",
    {
      donorFrequency: DataTypes.STRING
    },
    {}
  );
  DonorFrequency.associate = function(models) {
    // associations can be defined here
  };

  DonorFrequency.ONE_TIME_KEY = "One-Time";
  DonorFrequency.RECURRING_KEY = "Recurring";

  DonorFrequency.getFreq = function(key) {
    return DonorFrequency.findOne({
      donorFrequency: key
    });
  };

  DonorFrequency.getFreqId = function(key) {
    return DonorFrequency.getFreq(key).then(function(res) {
      return res.id;
    });
  }; 
  return DonorFrequency;
};
