const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// importing User Schema
require('./models/user_model');
require('./models/todo_model');

// Routes
const todoRoutes = require("./routes/todo_route");
const userRoutes = require("./routes/user_route");


// An instance of Express app
const app = express();
const PORT = 8080

const MONGO_DB_URL = "mongodb+srv://atharv:atharv7890@cluster0.ymunr.mongodb.net/" //connection string of MONGODB


// connecting to MONGODB database
mongoose.connect(MONGO_DB_URL);  // connect to database

// checking connection
mongoose.connection.on('connected', () => {
    console.log('Connection established to MongoDB');
})
// if error in connection
mongoose.connection.on('error', (error) => {
    console.log('connection error: ' + error);
})



// CORS for cross-origin requests
app.use(cors());

// Parse JSON requests
app.use(express.json());



// using routes
app.use("/", todoRoutes);
app.use("/", userRoutes);




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
