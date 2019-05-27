/* eslint-disable max-len */
'use strict';

module.exports = function(Item) {
  Item.getItems = function(itemIds, cb) {
    Item.find({where: {'itemId': {inq: itemIds}}}, function(err, Items) {
      if (err) {
        cb(err);
      } else {
        if (Items && Items !== null) {
          cb(null, Items);
        } else {
          cb(null, {'status': 'Not found'});
        }
      }
    });
  };

  Item.observe('before save', function(ctx, next) {
    var app = ctx.Model.app;

        // Apply this hooks for save operation only..
    if (ctx.isNewInstance) {
            // suppose my datasource name is mongodb
      var mongoDb = app.dataSources.mongodbDS;
      var mongoConnector = app.dataSources.mongodbDS.connector;
      mongoConnector.collection('counters').findOneAndUpdate({_id: 'Item'}, {$inc: {seq: 1}}, function(err, sequence) {
        if (err) {
          throw err;
        } else {
          ctx.instance.itemId = sequence.value.seq;
          next();
        }
      });
    } else {
      next();
    }
  });
};
