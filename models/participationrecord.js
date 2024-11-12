module.exports = (sequelize, DataTypes) => {
  const ParticipationRecord = sequelize.define("ParticipationRecord", {
    meetingId: DataTypes.INTEGER,
    attendeeId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    signature: DataTypes.TEXT,
  });

  ParticipationRecord.associate = (models) => {
    ParticipationRecord.belongsTo(models.Meeting, { foreignKey: "meetingId" });
    ParticipationRecord.belongsTo(models.Attendee, {
      foreignKey: "attendeeId",
    });
  };

  return ParticipationRecord;
};
