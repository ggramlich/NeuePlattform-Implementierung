"use strict";
var beschreibe = describe, es = it, vorJedem = beforeEach, nachJedem = afterEach;
var should = require('chai').should();
var anfrage = require('request');
var proxyquire =  require('proxyquire');

var port = 17125;

var sympaClientStub = {};
var gruppenAnwendungStub = proxyquire('../lib/gruppen', {'../gruppenverwaltung/swkSympaClient': sympaClientStub});
var anwendung = proxyquire('../app.js', {'./lib/gruppen': gruppenAnwendungStub});

var basis_uri = "http://localhost:" + port;
var veranstaltungen_uri = basis_uri + '/veranstaltungen';

beschreibe('SWK Plattform Server', function () {
  vorJedem(function (fertig) {
    anwendung.start(port, fertig);
  });

  nachJedem(function (fertig) {
    anwendung.stop(fertig);
  });

  es('antwortet auf GET für die Startseite', function (fertig) {
    anfrage({uri: basis_uri}, function (req, resp) {
      should.exist(resp);
      resp.statusCode.should.equal(200);
      fertig();
    });
  });

  es('antwortet mit HTML auf GET für die Startseite', function (fertig) {
    anfrage({uri: basis_uri}, function (req, resp) {
      resp.headers['content-type'].should.contain('text/html');
      fertig();
    });
  });

  es('enthält "Softwerkskammer" auf der Startseite', function (fertig) {
    anfrage({uri: basis_uri}, function (req, resp) {
      resp.body.should.contain('Softwerkskammer');
      fertig();
    });
  });

  es('enthält "Zukünftige Veranstaltungen" auf der Veranstaltungsseite', function (fertig) {
    anfrage({uri: veranstaltungen_uri}, function (req, resp) {
      resp.body.should.contain('Zukünftige Veranstaltungen');
      fertig();
    });
  });

  es('enthält "Veranstaltung X" für ein GET auf /veranstaltungen/X', function (fertig) {
    anfrage({uri: veranstaltungen_uri + '/X'}, function (req, resp) {
      resp.body.should.contain('Veranstaltung X');
      fertig();
    });
  });

  es('stellt das Stylesheet bereit', function (fertig) {
    var stylesheet_uri = basis_uri + '/stylesheets/style.css';
    anfrage({uri: stylesheet_uri}, function (req, resp) {
      resp.statusCode.should.equal(200);
      resp.headers['content-type'].should.contain('text/css');
      resp.body.should.contain('color:');
      fertig();
    });
  });

  es('zeigt die Liste der Gruppen an, so wie sie der SOAP Aufruf zurückliefert', function (fertig) {
    var gruppen_liste = [{id: 'gruppenId1', name: 'Gruppe 1'}];
    sympaClientStub.getGruppen = function (callback) {
      callback(null, gruppen_liste);
    };
    anfrage({uri: basis_uri + '/gruppen'}, function (req, resp) {
      resp.statusCode.should.equal(200);
      resp.body.should.contain('<a href="gruppen/gruppenId1">Gruppe 1</a>');
      fertig();
    });
  });
});
