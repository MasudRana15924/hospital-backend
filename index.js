const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const variables = require('./config/variables');

const port = process.env.PORT;



// mongoose.set('strictQuery', false);
mongoose.connect(variables.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connected");
}).catch((e)=>{
    console.log(e);
});
// Handling Uncaught Exception
process.on('uncaughtException', () => {
    process.exit(1);
});
app.get('/',(req,res)=>{
res.send("My hospital is running")
})
const server = app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
})
module.exports = server;