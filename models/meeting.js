module.exports = (sequelize, DataTypes) => {
  const Meeting = sequelize.define("Meeting", {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    location: DataTypes.STRING,
    type: DataTypes.ENUM("virtual", "hybrid", "physical"),
  });

  Meeting.associate = (models) => {
    Meeting.hasMany(models.ParticipationRecord, { foreignKey: "meetingId" });
  };

  return Meeting;
};
