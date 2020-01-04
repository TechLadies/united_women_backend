'use strict';

module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.sequelize.query('CREATE INDEX "Donations_campaignId_idx" ON "Donations" USING btree("campaignId")'),
      queryInterface.sequelize.query('CREATE INDEX "Donations_sourceId_idx" ON "Donations" USING btree("sourceId")'),
      queryInterface.sequelize.query('CREATE INDEX "Donations_donationDate_idx" ON "Donations" USING btree("donationDate")'),
      queryInterface.sequelize.query('CREATE INDEX "Donors_donorTypeId_idx" ON "Donors" USING btree("donorTypeId")')
    ])
  },
  down: (queryInterface) => {
    return Promise.all([
      queryInterface.sequelize.query('DROP INDEX "Donations_campaignId_idx"'),
      queryInterface.sequelize.query('DROP INDEX "Donations_sourceId_idx"'),
      queryInterface.sequelize.query('DROP INDEX "Donations_donationDate_idx"'),
      queryInterface.sequelize.query('DROP INDEX "Donors_donorTypeId_idx"')
    ])
  }
};
