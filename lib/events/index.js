"use strict";

var express = require('express');
var app = module.exports = express();

app.get('/', function (req, res) {
  res.send('Upcoming events');
});

app.get('/:id', function (req, res) {
  var id = req.params.id;
  res.send('The EVENT id ' + id);
});
