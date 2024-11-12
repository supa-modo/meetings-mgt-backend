module.exports = (sequelize, DataTypes) => {
  const Attendee = sequelize.define("Attendee", {
    title: DataTypes.STRING,
    organization: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
  });

  Attendee.associate = (models) => {
    Attendee.hasMany(models.ParticipationRecord, { foreignKey: "attendeeId" });
  };

  return Attendee;
};
