"use strict";

var startseitenAnwendung = require('express')();

startseitenAnwendung.get('/', function (req, res) {
  res.render('index', { titel: 'Hallo Softwerkskammer! :-)' });
});

module.exports = startseitenAnwendung;
