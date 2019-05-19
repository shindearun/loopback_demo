/* eslint-disable max-len */
'use strict';

const app = require('../server');

module.exports = function(Customer) {
  Customer.observe('before save', function(ctx, next) {
    var app = ctx.Model.app;

    // Apply this hooks for save operation only..
    if (ctx.isNewInstance) {
      // suppose my datasource name is mongodb
      var mongoDb = app.dataSources.mongodbDS;
      var mongoConnector = app.dataSources.mongodbDS.connector;
      mongoConnector.collection('counters').findOneAndUpdate({_id: 'Customer'}, {$inc: {seq: 1}}, function(err, sequence) {
        if (err) {
          throw err;
        } else {
          // Do what I need to do with new incremented value sequence.value
          // Save the tweet id with autoincrement..
          ctx.instance.customerId = sequence.value.seq;

          next();
        } // else
      });
    } else {
      next();
    }
  });

  Customer.getOrders = function(customerId, cb) {
    app.models.Order.getOrders(customerId, function(err, orders) {
      if (err) {
        cb(err);
      } else {
        if (orders && orders !== null) {
          cb(null, orders);
        } else {
          cb(null, {'status': 'Not found'});
        }
      }
    });
  };

  Customer.remoteMethod(
    'getOrders', {
      'description': 'Fetch the orders for the customer',
      'accepts': [
        {
          arg: 'customerId',
          type: 'number',
          'http': {source: 'path'},
        },
      ],
      'http': {
        'path': '/orders/:customerId',
        'verb': 'get',
      },
      'returns': {
        'arg': 'orders',
        'type': 'Object',
      },
    }
  );
};

