var gcm = require('node-gcm');
 
// Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
var sender = new gcm.Sender('AAAAdPVrPAw:APA91bEneA3X4L2LOjatfG8LOsGYPmzUjP3_Ak7jPIVHg6WHYXT9TdKX7IJFwFUNza0fzvuYyOa8j-PwHJqVV5iFyJViDEg4ymq_MABH7Yykr2CnIc5BW7QmqlyYsgaSS9-Gwq2XsiPB');
 
// Prepare a message to be sent
var message = new gcm.Message({
    contentAvailable: true,
    data: { key1: 'msg1' },
    notification: {
        sound: 'default',
        title: "Hello Mi, World",
        body: "This is a notification that will be displayed if your app is in the background."
    }
});
 
// Specify which registration IDs to deliver the message to
var regTokens = ['cj_fCSvscvc:APA91bEq6uTpWUql50Um7Y1VpZc6fq1xXjfdt0d70ziTQLbAU4Xb6VHIyyj4ddsfuDNSsYqVN_qN5rg0QrAvcjZq0MKcyhKhh4_RLmNFT1k4LCiNTj2Zxhk0O9XOXBAVbYvwq2ZAzyxL'];
 
// Actually send the message
sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    if (err) console.error(err);
    else console.log(response);
});