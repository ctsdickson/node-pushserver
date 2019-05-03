/**
 * GeTui push notification handling
 */

var config = require('./Config');
var log = require('./Log');
var _ = require('lodash');

var getuiClient = require('node-getui');
var Target = require('node-getui/getui/Target');
var SingleMessage = require('node-getui/getui/message/SingleMessage');
var TransmissionTemplate = require('node-getui/getui/template/TransmissionTemplate');
var pushAssociations = require('./PushAssociations');

var HOST;
var APPID;
var APPKEY;



var push = function (tokens, message) {

    log.info("start gettuiPusher.push");
    getuiSender().connect(function(){
        var transTemplate =  new TransmissionTemplate({
            appId: APPID,
            appKey: APPKEY
        });
        var mesgData = _.defaults(transTemplate, message);
        var singleMesg = new SingleMessage({
            isOffline: true,                        //是否离线
            offlineExpireTime: 3600 * 1 * 1000,    //离线时间
            data: mesgData                          //设置推送消息类型
        });
        
        tokens.forEach(function (token){
            var sendMesg = singleMesg;
            log.debug("Token:"+token);
            log.debug(sendMesg);
            var target = new Target({
                appId: APPID,
                clientId: token
                //alias:ALIAS
            });
            getuiSender().pushMessageToSingle(sendMesg,target,
              function(err, response){
               if (err) {
                   log.error(err);
                   var requestId = err.exception.requestId;
                   getuiSender().pushMessageToSingle(message,target,requestId,function(err, res){
                        log.error(err);
                        log.info(res);
                    });
               } else {
                   log.info("Successfully sent with response: ", response);
               }
             });
        });
    });

};

var buildPayload = function (options) {
    message = options;
    return message;
};

var getuiSender = _.once(function() {
    HOST = config.get('getui').host;
    APPID = config.get('getui').appId;
    APPKEY = config.get('getui').appKey;
    
    log.debug("GETUI HOST:"+HOST);
    log.debug("GETUI APP ID:"+APPID);
    log.debug("GETUI APP KEY:"+APPKEY);
    log.debug("GETUI MASTERSECRET:"+config.get('getui').masterSecret);
    return new getuiClient(HOST,APPKEY, config.get('getui').masterSecret);
});

module.exports = {
    push: push,
    buildPayload:buildPayload
}
