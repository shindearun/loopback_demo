/* eslint-disable max-len */
'use strict';

module.exports = function(Order) {
  Order.getOrders = function(customerId, cb) {
    Order.find({where: {'customerId': customerId}}, function(err, orderInstance) {
      if (err) {
        cb(err);
      } else {
        if (orderInstance && orderInstance !== null) {
          cb(null, orderInstance);
        } else {
          cb(null, {'status': 'Not found'});
        }
      }
    });
  };

  Order.observe('before save', function(ctx, next) {
    var app = ctx.Model.app;

    // Apply this hooks for save operation only..
    if (ctx.isNewInstance) {
      // suppose my datasource name is mongodb
      var mongoDb = app.dataSources.mongodbDS;
      var mongoConnector = app.dataSources.mongodbDS.connector;
      mongoConnector.collection('counters').findOneAndUpdate({_id: 'Order'}, {$inc: {seq: 1}}, function(err, sequence) {
        if (err) {
          throw err;
        } else {
          ctx.instance.orderId = sequence.value.seq;
          next();
        }
      });
    } else {
      next();
    }
  });
};
