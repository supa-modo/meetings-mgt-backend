const { Attendee, ParticipationRecord } = require('../models');

// Create a new attendee
exports.createAttendee = async (req, res) => {
  const { title, organization, phone, email, name, userId } = req.body;
  try {
    const attendee = await Attendee.create({ title, organization, phone, email, name, userId });
    res.status(201).json(attendee);
  } catch (error) {
    res.status(500).json({ error: 'Error creating attendee', details: error.message });
  }
};

// Get all attendees
exports.getAllAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.findAll();
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching attendees', details: error.message });
  }
};

// Get a single attendee by ID
exports.getAttendeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const attendee = await Attendee.findByPk(id, {
      include: ParticipationRecord, // Include participation records
    });
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching attendee', details: error.message });
  }
};

// Update an attendee
exports.updateAttendee = async (req, res) => {
  const { id } = req.params;
  const { title, organization, phone, email, name, userId } = req.body;
  try {
    const attendee = await Attendee.findByPk(id);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    await attendee.update({ title, organization, phone, email, name, userId });
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ error: 'Error updating attendee', details: error.message });
  }
};

// Delete an attendee
exports.deleteAttendee = async (req, res) => {
  const { id } = req.params;
  try {
    const attendee = await Attendee.findByPk(id);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    await attendee.destroy();
    res.status(204).json({ message: 'Attendee deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting attendee', details: error.message });
  }
};
