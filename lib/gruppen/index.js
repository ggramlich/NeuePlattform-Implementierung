"use strict";

var gruppenAnwendung = require('express')();
gruppenAnwendung.set('views', __dirname + '/views');
gruppenAnwendung.set('view engine', 'jade');

var sympaClient = require('../gruppenverwaltung/swkSympaClient');

gruppenAnwendung.get('/', function (req, res) {
  sympaClient.getGruppen(function (err, gruppen) {
    res.render('gruppen', {titel: 'Gruppen', gruppen: gruppen});
  });
});

module.exports = gruppenAnwendung;
