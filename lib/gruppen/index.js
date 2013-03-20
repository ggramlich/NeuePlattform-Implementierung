"use strict";

var gruppenApp = require('express')();
gruppenApp.set('views', __dirname + '/views');
gruppenApp.set('view engine', 'jade');

module.exports = function (sympaClient) {
  gruppenApp.get('/', function (req, res) {
    sympaClient.getGruppen(function (err, gruppen) {
      res.render('gruppen', {title: 'Gruppen', gruppen: gruppen});
    });
  });
  return gruppenApp;
};
