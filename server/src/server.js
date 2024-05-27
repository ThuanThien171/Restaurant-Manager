require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const configView = require('./config/configView');
const webRoute = require('./routes/route');
const connectDB = require('./config/configSql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5555;

//const hostname = process.env.HOST_NAME;

//CORS
// app.use(cors({ credentials: true, origin: true }));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


//bodyParser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

connectDB();

//config 'views' + 'public'
configView(app);

//route
app.use('/', webRoute);


app.listen(port, () => {
    console.log(`Server running at http://${port}/`); //call back
});