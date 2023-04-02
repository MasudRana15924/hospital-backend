const express = require('express');
const connectDatabase = require('./config/connection');
const app = express();
require('dotenv').config();
app.use(express.json());
const port = process.env.PORT;
connectDatabase();
const user=require('./route/userRoutes')

app.use("/api", user);

// Handling Uncaught Exception
process.on('uncaughtException', () => {
    process.exit(1);
});
const server = app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
});
module.exports = server;