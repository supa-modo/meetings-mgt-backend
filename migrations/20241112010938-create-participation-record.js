'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ParticipationRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      meetingId: {
        type: Sequelize.INTEGER
      },
      attendeeId: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      signature: {
        type: Sequelize.TEXT
      },
      meetingRole: { // New field added
        type: Sequelize.STRING,
        allowNull: true, // Change to false if required
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ParticipationRecords');
  }
};
