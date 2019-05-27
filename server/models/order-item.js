/* eslint-disable max-len */
'use strict';
const app = require('../server');

module.exports = function(OrderItem) {
  OrderItem.getItemsForOrder = function(orderId, cb) {
    var items;
    OrderItem.find({where: {'orderId': orderId}}, function(err, orderItems) {
      if (err) {
        cb(err);
      } else {
        if (orderItems && orderItems !== null) {
          var itemsIds = orderItems.map((orderItem) => orderItem.itemId);
          app.models.Item.getItems(itemsIds, function(err, items) {
            if (err) {
              cb(err);
            } else {
              if (items && items !== null) {
                cb(null, items);
              } else {
                cb(null, {'status': 'Not found'});
              }
            }
          });
        } else {
          cb(null, {'status': 'Not found'});
        }
      }
    });
  };
};
