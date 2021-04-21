// Constants
var agoraAppId = 'a6af85f840ef43108491705e2315a857';
const msgBox = document.getElementById('msg');
const messageBox = document.getElementById('messageBox');
const sendBtn = document.getElementById('sendBtn');
var userName = '';
var channelName = 'rush';
var isLoggedIn = false;

// RtmClient
const rtcClient = AgoraRTM.createInstance(agoraAppId, {
  enableLogUpload: false,
});

const initChat = () => {
  // Login
  rtcClient.login({ uid: userName }).then(() => {
    console.log('AgoraRTM client login success. Username: ' + userName);
    isLoggedIn = true;

    // Channel Join
    const channel = rtcClient.createChannel(channelName);
    channel
      .join()
      .then(() => {
        console.log('AgoraRTM client channel join success.');

        // Send Channel Message
        sendBtn.addEventListener('click', function () {
          console.log(msgBox.value);
          singleMessage = msgBox.value;
          singleMessage &&
            channel
              .sendMessage({ text: singleMessage })
              .then(() => {
                console.log('Message sent successfully.');
                console.log(
                  'Your message was: ' + singleMessage + ' by ' + userName
                );
                let msg = document.createElement('div');
                msg.innerHTML =
                  '<br> <b>Sender:</b> ' +
                  userName +
                  '<br> <b>Message:</b> ' +
                  singleMessage +
                  '<br>';
                messageBox.appendChild(msg);
              })
              .catch((error) => {
                console.log("Message wasn't sent due to an error: ", error);
              });

          // Receive Channel Message
          channel.on('ChannelMessage', ({ text }, senderId) => {
            console.log('Message received successfully.');
            console.log('The message is: ' + text + ' by ' + senderId);
            let msg = document.createElement('div');
            msg.innerHTML =
              '<br> <b>Sender:</b> ' +
              senderId +
              '<br> <b>Message:</b> ' +
              text +
              '<br>';
            messageBox.appendChild(msg);
          });
        });
      })
      .catch((error) => {
        console.log('AgoraRTM client channel join failed: ', error);
      })
      .catch((err) => {
        console.log('AgoraRTM client login failure: ', err);
      });
  });
};

// Form Click Event
const getUserName = () => {
  const getName = prompt('what is your name? ');
  userName = getName;
  userName && initChat();
};
getUserName();
// // Show Form on Page Load
// $(document).ready(function () {
//   $('#joinChannelModal').modal();
//   $('#joinChannelModal').modal('open');
// });

// Logout
function leaveChannel() {
  // channel.leave();
  // client.logout();
  // isLoggedIn = false;
  // $('#joinChannelBtn').prop('disabled', false);
  // $('#sendMsgBtn').prop('disabled', true);
  // $('#joinChannelModal').modal('open');
  // console.log('Channel left successfully and user has been logged out.');
}
