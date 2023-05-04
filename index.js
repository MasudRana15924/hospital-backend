const express = require('express');
const connectDatabase = require('./config/connection');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));


const port = process.env.PORT || 5000;
connectDatabase();
const routes = require('./route/routes');
app.use("/api", routes);

const server = app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
});

module.exports = server;