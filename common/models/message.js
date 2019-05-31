module.exports = function(Message) {
  Message.greet = function(msg, name, cb) {
    process.nextTick(function() {
      msg = msg || 'hello';
      cb(null, 'Sender says ' + msg + ' to ' + name + ' receiver');
    });
  };
};
