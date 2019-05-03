/**
 * Pushy push notification handling
 */

var config = require('./Config');
var log = require('./Log');
var _ = require('lodash');

var pushyClient = require('pushy');

var push = function (tokens, message) {
    log.info("start pushyPusher.push");
    tokens.forEach(function (token){
      log.debug("Token:"+token);
      log.debug(message);
      pushySender().sendPushNotification(message.data, token, message.options,
        function(err, response){
         if (err) {
             log.error(err);
         } else {
             log.info("Successfully sent with response: ", response);
         }
       });
    });
};

var buildPayload = function (options) {
    message = options;
    return message;
};

var pushySender = _.once(function() {
    log.debug("PUSHY Secret API KEY:"+config.get('pushy').apiKey);
    return new pushyClient(config.get('pushy').apiKey);
});

module.exports = {
    push: push,
    buildPayload:buildPayload
}
