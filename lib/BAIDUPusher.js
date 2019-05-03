/**
 * BaiDu push notification handling
 */

var config = require('./Config');
var log = require('./Log');
var _ = require('lodash');
var baiduClient = require('node-baidu-push/lib/client');
var pushAssociations = require('./PushAssociations');
var message;


var push = function (tokens, message) {

    log.info("start baiduPusher.push");
    tokens.forEach(function (token){
      var sendMesg = _.defaults({}, message, config.get('baidu-android'));
      log.debug("Token:"+token);
      log.debug(sendMesg);
      baiduSender().pushMsgToSingleDevice(token, sendMesg,
        { msg_type: config.get('baidu').msg_type },
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

var baiduSender = _.once(function() {
    log.debug("BAIDU API KEY:"+config.get('baidu').apiKey);
    log.debug("BAIDU SCRECT KEY:"+config.get('baidu').secretKey);
    return new baiduClient(config.get('baidu').apiKey, config.get('baidu').secretKey);
});

module.exports = {
    push: push,
    buildPayload:buildPayload
}
