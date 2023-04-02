const express = require('express');
const connectDatabase = require('./config/connection');
const app = express();
require('dotenv').config();
app.use(express.json());
const port = process.env.PORT || 5000;
connectDatabase();
const routes=require('./route/routes')

app.use("/api", routes);

// Handling Uncaught Exception
process.on('uncaughtException', () => {
    process.exit(1);
});
const server = app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
});
module.exports = server;