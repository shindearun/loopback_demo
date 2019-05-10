/* eslint-disable max-len */
'use strict';

const app = require('../server/server');

// const ds = app.datasources.mongodbDS;

var ds = app.dataSources.mongodbDS;
var lbTables = ['Customer', 'Order'];
ds.autoupdate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' + lbTables + '] sync in ', ds.adapter.name);
  ds.disconnect();
});
