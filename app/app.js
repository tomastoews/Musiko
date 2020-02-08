const express = require('express');
const dotenv = require('dotenv').config();
const router = require('./router');
const path = require('path');
const cors = require('cors');
const handlebars = require('express-handlebars');
const port = process.env.PORT;

const app = express();

app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));
app.use(cors({'allow-orign': '*'}));
app.use(express.static(__dirname + '/public'));
app.use(`${process.env.BASE_URL}/`, router);

app.use('*/css',express.static(path.join(__dirname, '/public/css')));
app.use('*/js',express.static(path.join(__dirname, '/public/js')));

app.listen(port, () => console.log(`App is running on http://localhost:${port}/musiko`));