"use strict";
module.exports = (sequelize, DataTypes) => {
  const Salutation = sequelize.define(
    "Salutation",
    {
      salutation: DataTypes.STRING
    },
    {}
  );
  Salutation.associate = function(models) {
    // associations can be defined here
  };

  /*
  Salutation.MR = "Mr";
  Salutation.MS = "Ms";
  Salutation.MISS = "Miss";
  Salutation.MRS = "Mrs";
  Salutation.DR = "Dr";
  */
 
  // finds the corresponding record, creates new record if salutation not found
  Salutation.getSalutation = function(key) {
    return Salutation.findOrCreate({
      where: { salutation: key }
    });
  };

  Salutation.getSalutationId = function(key) {
    return Salutation.getSalutation(key).then(function(res) {
      return res[0].dataValues.id;
    });
  };

  return Salutation;
};
