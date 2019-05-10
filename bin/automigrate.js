/* eslint-disable max-len */
'use strict';

const app = require('../server/server');

var ds = app.dataSources.mongodbDS;
// var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'Customer', 'Order'];
var lbTables = ['Customer', 'Order'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});
