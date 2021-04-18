// create Agora client
var client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
var localTracks = {
  videoTrack: null,
  audioTrack: null,
};
var remoteUsers = {};
// Agora client options
var options = {
  appid: '306d86f1ec2644c3affab320daef132c',
  channel: 'live',
  uid: null,
  token:
    '006306d86f1ec2644c3affab320daef132cIACy4QTOQ7YuSW/owv1KAETJNeKgDYYd3BdnD8pnQ+iBG68sD1MAAAAAEACU3jyLM7N9YAEAAQAys31g',
  role: 'audience', // host or audience
};
let newStreamBtn = document.getElementById('new');
let joinStreamBtn = document.getElementById('join');
let leaveSreamBtn = document.getElementById('leave');

newStreamBtn.addEventListener('click', async function (e) {
  options.role = 'host';
  console.log(options.role);
  await join();
});

joinStreamBtn.addEventListener('click', async function (e) {
  options.role = 'audience';
  await join();
  console.log(options.role);
});

leaveSreamBtn.addEventListener('click', function (e) {
  leave();
});

async function join() {
  // create Agora client
  client.setClientRole(options.role);

  if (options.role === 'audience') {
    // add event listener to play remote tracks when remote user publishs.
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
  }

  // join the channel
  options.uid = await client.join(
    options.appid,
    options.channel,
    options.token || null
  );

  if (options.role === 'host') {
    // create local audio and video tracks
    localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
    // play local video track
    localTracks.videoTrack.play('local-player');
    document.getElementById(
      'local-scream-id'
    ).innerHTML = `localTrack(${options.uid})`;
    // publish local tracks to channel
    await client.publish(Object.values(localTracks));
    console.log('publish success');
  }

  newStreamBtn.setAttribute('disabled', true);
  joinStreamBtn.setAttribute('disabled', true);
  leaveSreamBtn.removeAttribute('disabled');
}

async function leave() {
  for (let trackName in localTracks) {
    var track = localTracks[trackName];
    if (track) {
      track.stop();
      track.close();
      localTracks[trackName] = undefined;
    }
  }

  // remove remote users and player views
  remoteUsers = {};
  document.getElementById('remote-playerlist').innerHTML = '';

  // leave the channel
  await client.leave();
  document.getElementById('local-scream-id').innerHTML = '';
  console.log('client leaves channel success');

  newStreamBtn.removeAttribute('disabled', false);
  joinStreamBtn.removeAttribute('disabled', false);
  leaveSreamBtn.setAttribute('disabled', true);
}

async function subscribe(user, mediaType) {
  const uid = user.uid;
  // subscribe to a remote user
  await client.subscribe(user, mediaType);
  console.log('subscribe success');
  const remotePlayerList = document.getElementById('remote-playerlist');
  if (mediaType === 'video') {
    const player = `
      <div id="player-wrapper-${uid}">
        <p class="player-name">remoteUser(${uid})</p>
        <div id="player-${uid}" class="player"></div>
      </div>
    `;
    const videoFrame = document.createElement('div');
    videoFrame.innerHTML = player;
    remotePlayerList.appendChild(videoFrame);
    user.videoTrack.play(`player-${uid}`);
  }
  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
}

function handleUserPublished(user, mediaType) {
  const id = user.uid;
  remoteUsers[id] = user;
  subscribe(user, mediaType);
}

function handleUserUnpublished(user) {
  const id = user.uid;
  delete remoteUsers[id];
  document.getElementById(`#player-wrapper-${id}`).remove();
}

// -----------------------------------------------------
// -------------------------AUDIENCE--------------------
// Publish Stream
// client.on('stream-published', function (evt) {});

// // Connect New People
// client.on('stream-added', function (evt) {
//   var stream = evt.stream;
//   client.subscribe(stream, function (err) {});
// });

// client.on('stream-subscribed', function (evt) {
//   var remoteStream = evt.stream;
//   var remoteId = remoteStream.getId();

//   mainStreamId = remoteId;
//   remoteStream.play('local-player');

//   // addRemoteStreamMiniView(remoteStream);
// });

// // Stop Stream
// client.on('stream-removed', function (evt) {
//   var stream = evt.stream;
//   stream.stop();
//   stream.close();
// });

// // Stop Stream When Leaving
// client.on('peer-leave', function (evt) {
//   evt.stream.stop();
// });
