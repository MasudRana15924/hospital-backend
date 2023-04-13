const express = require('express');
const connectDatabase = require('./config/connection');
const app = express();
require('dotenv').config();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000;
connectDatabase();
const routes = require('./route/routes');
app.use("/api", routes);

const server = app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
});

module.exports = server;