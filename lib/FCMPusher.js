/**
 * Firebase push notification handling
 */

var config = require('./Config')
var _ = require('lodash');
var fcm = require('fcm-push');
var pushAssociations = require('./PushAssociations');
var message;


var push = function (tokens, message) {
    // fcmSender().send(message, tokens, 4, function (err, res) {
    //     if(err) console.log(err);
    //
    //     if (res) {
    //         var mappedResults = _.map(_.zip(tokens, res.results), function (arr) {
    //             return _.merge({token: arr[0]}, arr[1]);
    //         });
    //
    //         handleResults(mappedResults);
    //     }
    // })
    console.log("start fcmPusher.push");
    console.log(tokens);
    console.log(message);
    tokens.forEach(function (token){
      var toToken = { "to": token };
      var sendMesg = _.defaults(message,toToken);
      console.log(sendMesg);
      fcmSender().send(sendMesg, function(err, response){
         if (err) {
             console.log(err);
         } else {
             console.log("Successfully sent with response: ", response);
            //  var mappedResults = _.map(_.zip(tokens, response.results), function (arr) {
            //      return _.merge({token: arr[0]}, arr[1]);
            //  });
            //  console.log(mappedResults);
            //  handleResults(mappedResults);
         }
       });
    });
};

var handleResults = function (results) {
    var idsToUpdate = [],
        idsToDelete = [];

    results.forEach(function (result) {
        if (!!result.registration_id) {
            idsToUpdate.push({from: result.token, to: result.registration_id});

        } else if (result.error === 'InvalidRegistration' || result.error === 'NotRegistered') {
            idsToDelete.push(result.token);
        }
    });

    if (idsToUpdate.length > 0) pushAssociations.updateTokens(idsToUpdate);
    if (idsToDelete.length > 0) pushAssociations.removeDevices(idsToDelete);
};

var buildPayload = function (options) {
    message = options;
    return message;
};

var fcmSender = _.once(function() {
    console.log(config.get('gcm').apiKey);
    return new fcm(config.get('gcm').apiKey);
});

module.exports = {
    push: push,
    buildPayload:buildPayload
}
