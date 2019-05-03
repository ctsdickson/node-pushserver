/**
 * Firebase push notification handling
 */

var config = require('./Config');
var log = require('./Log');
var _ = require('lodash');
var fcm = require('fcm-push');
var pushAssociations = require('./PushAssociations');
var message;

var push = function (tokens, message) {

    log.info("start fcmPusher.push");
    tokens.forEach(function (token){
      var toToken = { "to": token };
      var sendMesg = _.defaults({}, message, toToken);
      log.debug(sendMesg);
      fcmSender().send(sendMesg, function(err, response){
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

var fcmSender = _.once(function() {
    log.debug("FCM API KEY:"+config.get('fcm').apiKey);
    return new fcm(config.get('fcm').apiKey);
});

module.exports = {
    push: push,
    buildPayload:buildPayload
}
