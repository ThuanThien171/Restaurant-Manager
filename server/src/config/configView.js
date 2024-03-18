const path = require('path');
const express = require('express');

const configView = (app) => {
    //config template engine(views)
    app.set('views', path.join('./src', 'views'));
    app.set('view engine', 'ejs');

    //config static file (public)
    app.use(express.static(path.join('./src', 'public')));
}
module.exports = configView;