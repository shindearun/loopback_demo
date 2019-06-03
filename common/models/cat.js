'use strict';

module.exports = function(Cat) {
  Cat.observe('before save', function(ctx, next) {
    var app = ctx.Model.app;
    if (ctx.isNewInstance) {
		// suppose my datasource name is mongodb
      var mongoDb = app.dataSources.mongodbDS;
      var mongoConnector = app.dataSources.mongodbDS.connector;
  // eslint-disable-next-line max-len
      mongoConnector.collection('counters').findOneAndUpdate({_id: 'Cat'}, {$inc: {seq: 1}}, function(err, sequence) {
        if (err) {
          throw err;
        } else {
          ctx.instance.catId = sequence.value.seq;
          ctx.instance.updated = new Date();
          next();
        }
      });
    } else  if (ctx.instance) {
      ctx.instance.updated = new Date();
    } else {
      next();
    }
  });

  Cat.afterRemote('findById', function(ctx, cat, next) {
    cat.description = cat.name + ' is ' + cat.age +
			' years old and is a ' + cat.breed;
    next();
  });

  Cat.adoptable = function(catId, cb) {
    Cat.findOne({'where': {'catId': catId}}, function(err, cat) {
      if (err) return cb('Error', null);
      if (!cat) return cb('Cat not found', null);
      let canAdopt = false;
      if (cat.breed != 'tiger' || (cat.age >= 10)) canAdopt = true;
      cb(null, canAdopt);
    });
  };

  Cat.remoteMethod('adoptable', {
    http: {verb: 'get', path: '/adoptable'},
    accepts: {arg: 'catId', type: 'any'},
    returns: {arg: 'adoptable', type: 'boolean'},
  });

  Cat.validatesInclusionOf('gender', {'in': ['male', 'female']});
  Cat.validatesNumericalityOf('age', {int: true});

  Cat.validate('age', function(err) {
    if (this.age <= 0) err();
  }, {message: 'Must be positive'});
};
