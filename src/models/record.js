"use strict"
module.exports = (sequelize, DataTypes) => {
  const record = sequelize.define(
    "record",
    {
      filename: DataTypes.STRING,
      sourceId: DataTypes.INTEGER,
      dateUploaded: DataTypes.DATE,
      uploadedBy: DataTypes.INTEGER
    },
    {}
  )
  record.associate = function(models) {
    // associations can be defined here
  }
  return record
}
