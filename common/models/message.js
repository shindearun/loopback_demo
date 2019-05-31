// eslint-disable-next-line strict
module.exports = function(Message) {
  Message.greet = function(msg, name, cb) {
    process.nextTick(function() {
      msg = msg || 'hello';
      cb(null, 'Sender says ' + msg + ' to ' + name + ' receiver');
    });
  };

  Message.customCreate = function(data, context, callback) {
    console.log(context);
    Message.create({
      title: data.title,
      description: data.description,
    }, (err, message) => {
      if (err) {
        callback(err);
      }
      callback(null, message);
    });
  };

  Message.remoteMethod('customCreate', {
    http: {
      verb: 'post',
      path: '/custom-create',
    },
    accepts: [
      {
        arg: 'data',
        type: 'object',
        http: {
          source: 'body',
        },
      },
      {
        arg: 'context',
        type: 'object',
        http: 'optionsFromRequest',
      }],
    returns: {
      arg: 'message',
      type: 'object',
    },
  });
};
