const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT_URL = process.env.PORT || 3500;
const { sequelize } = require("./models");
const meetingRoutes = require("./routes/meetingRoutes");
const attendeeRoutes = require("./routes/attendeeRoutes");
const participationRecordRoutes = require("./routes/participationRecordsRoutes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// CORS middleware to allow cross-origin requests from your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  })
);

// Routes
app.use("/api/meetings", meetingRoutes); // Meeting routes
app.use("/api/attendees", attendeeRoutes); // Attendee routes
app.use("/api/participation", participationRecordRoutes); // Participation routes

sequelize
  .sync()
  .then(() => {
    console.log("Database connected and synced");
    app.listen(PORT_URL, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT_URL}`);
    });
  })
  .catch((error) => console.log("Error connecting to database:", error));
