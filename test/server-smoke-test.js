"use strict";
var should = require('chai').should();
var request = require('request');
var proxyquire =  require('proxyquire');

var port = 17125;

var sympaClientStub = {};
var gruppenAnwendungStub = proxyquire('../lib/gruppen', {'../gruppenverwaltung/swkSympaClient': sympaClientStub});
var app = proxyquire('../app.js', {'./lib/gruppen': gruppenAnwendungStub});

var basis_uri = "http://localhost:" + port;
var veranstaltungen_uri = basis_uri + '/events';

describe('SWK Plattform Server', function () {
  beforeEach(function (done) {
    app.start(port, done);
  });

  afterEach(function (done) {
    app.stop(done);
  });

  it('responds on a GET for the home page', function (done) {
    request({uri: basis_uri}, function (req, resp) {
      should.exist(resp);
      resp.statusCode.should.equal(200);
      done();
    });
  });

  it('responds with HTML on a GET for the home page', function (done) {
    request({uri: basis_uri}, function (req, resp) {
      resp.headers['content-type'].should.contain('text/html');
      done();
    });
  });

  it('shows "Softwerkskammer" on the home page', function (done) {
    request({uri: basis_uri}, function (req, resp) {
      resp.body.should.contain('Softwerkskammer');
      done();
    });
  });

  it('shows "Upcoming events" on the event page', function (done) {
    request({uri: veranstaltungen_uri}, function (req, resp) {
      resp.body.should.contain('Zukünftige Veranstaltungen');
      done();
    });
  });

  it('shows "Event X" for GET /events/X', function (done) {
    request({uri: veranstaltungen_uri + '/X'}, function (req, resp) {
      resp.body.should.contain('Veranstaltung X');
      done();
    });
  });

  it('provides the style sheet', function (done) {
    var stylesheet_uri = basis_uri + '/stylesheets/style.css';
    request({uri: stylesheet_uri}, function (req, resp) {
      resp.statusCode.should.equal(200);
      resp.headers['content-type'].should.contain('text/css');
      resp.body.should.contain('color:');
      done();
    });
  });

  it('shows the list of gruppen as retrieved by the SOAP call', function (done) {
    var gruppen_liste = [{id: 'gruppenId1', name: 'Gruppe 1'}];
    sympaClientStub.getGruppen = function (callback) {
      callback(null, gruppen_liste);
    };
    request({uri: basis_uri + '/gruppen'}, function (req, resp) {
      resp.statusCode.should.equal(200);
      resp.body.should.contain('<a href="gruppen/gruppenId1">Gruppe 1</a>');
      done();
    });
  });
});
