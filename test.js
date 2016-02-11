var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');


// fsb classes
var Fsbdb = require('./fsbdb');
var fsbdb = new Fsbdb();

fsbdb.getForumsWithTasks(function(forums){
  console.log(forums);
}) // fsbdb.
