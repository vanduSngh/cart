const http = require('http');
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/cart', {
}).then(() => {
    console.log('DB connection established');
}).catch(error => {
    console.error('Could not establish mongoose connection');
})



app
    .use(bodyParser.json({ limit: "50mb", extended: true }))
    .use('/cart', require('./cart.routes'))


const server = http.createServer(app);
server.listen(port, function () {
    console.info(`server is running at port: ${port}`);
});