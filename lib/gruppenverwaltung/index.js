"use strict";

var gruppenverwaltungAnwendung = require('express')();

var swkSympaClient = require('./swkSympaClient');

gruppenverwaltungAnwendung.get('/', function (req, res) {
  var responseCallback = function (soapResult) {
      var myResponse = "Gruppenverwaltung " +
          "\n" +
          "\n" +
          "Test der SOAP Kommunikation mit Sympa " +
          "\n" +
          "\n" +
          "Response auf den Info Request:" +
          "\n" +
          "\n" +
          soapResult;

      res.setHeader('Content-Type', 'text/plain');
      res.end(myResponse);
    };

  swkSympaClient.getInfoRequest(responseCallback);

});

module.exports = gruppenverwaltungAnwendung;
