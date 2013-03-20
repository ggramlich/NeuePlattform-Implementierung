"use strict";

var veranstaltungsAnwendung = require('express')();

veranstaltungsAnwendung.get('/', function (req, res) {
  res.render('index', { titel: 'Zukünftige Veranstaltungen' });
});

veranstaltungsAnwendung.get('/:id', function (req, res) {
  res.render('index', { titel: 'Veranstaltung ' + req.params.id });
});

module.exports = veranstaltungsAnwendung;
