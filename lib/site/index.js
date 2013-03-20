"use strict";

var siteApp = require('express')();

siteApp.get('/', function (req, res) {
  res.render('index', { titel: 'Hallo Softwerkskammer! :-)' });
});

module.exports = siteApp;
