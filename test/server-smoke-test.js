"use strict";
var beschreibe = describe, er = it, vorJedem = beforeEach, nachJedem = afterEach;
var should = require('chai').should();
var frageAn = require('request');
var proxyquire =  require('proxyquire');

var port = 17125;

var sympaClientStub = {};
var gruppenAnwendungStub = proxyquire('../lib/gruppen', {'../gruppenverwaltung/swkSympaClient': sympaClientStub});
var anwendung = proxyquire('../anwendung.js', {'./lib/gruppen': gruppenAnwendungStub});

var basis_uri = "http://localhost:" + port;
var veranstaltungen_uri = basis_uri + '/veranstaltungen';

beschreibe('SWK Plattform Server', function () {
  vorJedem(function (fertig) {
    anwendung.start(port, fertig);
  });

  nachJedem(function (fertig) {
    anwendung.stop(fertig);
  });

  er('antwortet auf GET für die Startseite', function (fertig) {
    frageAn({uri: basis_uri}, function (anfrage, antwort) {
      should.exist(antwort);
      antwort.statusCode.should.equal(200);
      fertig();
    });
  });

  er('antwortet mit HTML auf GET für die Startseite', function (fertig) {
    frageAn({uri: basis_uri}, function (anfrage, antwort) {
      antwort.headers['content-type'].should.contain('text/html');
      fertig();
    });
  });

  er('enthält "Softwerkskammer" auf der Startseite', function (fertig) {
    frageAn({uri: basis_uri}, function (anfrage, antwort) {
      antwort.body.should.contain('Softwerkskammer');
      fertig();
    });
  });

  er('enthält "Zukünftige Veranstaltungen" auf der Veranstaltungsseite', function (fertig) {
    frageAn({uri: veranstaltungen_uri}, function (anfrage, antwort) {
      antwort.body.should.contain('Zukünftige Veranstaltungen');
      fertig();
    });
  });

  er('enthält "Veranstaltung X" für ein GET auf /veranstaltungen/X', function (fertig) {
    frageAn({uri: veranstaltungen_uri + '/X'}, function (anfrage, antwort) {
      antwort.body.should.contain('Veranstaltung X');
      fertig();
    });
  });

  er('stellt das Stylesheet bereit', function (fertig) {
    var stylesheet_uri = basis_uri + '/stylesheets/style.css';
    frageAn({uri: stylesheet_uri}, function (anfrage, antwort) {
      antwort.statusCode.should.equal(200);
      antwort.headers['content-type'].should.contain('text/css');
      antwort.body.should.contain('color:');
      fertig();
    });
  });

  er('zeigt die Liste der Gruppen an, so wie sie der SOAP Aufruf zurückliefert', function (fertig) {
    var gruppen_liste = [{id: 'gruppenId1', name: 'Gruppe 1'}];
    sympaClientStub.getGruppen = function (callback) {
      callback(null, gruppen_liste);
    };
    frageAn({uri: basis_uri + '/gruppen'}, function (anfrage, antwort) {
      antwort.statusCode.should.equal(200);
      antwort.body.should.contain('<a href="gruppen/gruppenId1">Gruppe 1</a>');
      fertig();
    });
  });
});
