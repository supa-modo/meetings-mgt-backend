module.exports = (sequelize, DataTypes) => {
  const ParticipationRecord = sequelize.define("ParticipationRecord", {
    meetingId: DataTypes.INTEGER,
    attendeeId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    signature: DataTypes.TEXT,
    meetingRole: {
      // New field added
      type: DataTypes.STRING,
      allowNull: true, // Change to false if required
    },
  });

  ParticipationRecord.associate = (models) => {
    ParticipationRecord.belongsTo(models.Meeting, { foreignKey: "meetingId" });
    ParticipationRecord.belongsTo(models.Attendee, {
      foreignKey: "attendeeId",
    });
  };

  return ParticipationRecord;
};
