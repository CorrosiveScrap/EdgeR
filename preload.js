const { ipcRenderer, electron, contextBridge, } = require('electron');
console.log('preloaded script ran')


ipcRenderer.on('getimages-reply', (event, modifiedDocuments, modifiedPath) => {
  // Handle the modified documents data here
  console.log('Received array main process: ' + modifiedDocuments[0]);
  console.log('Received flder path main process: ' + modifiedPath);

  if (modifiedDocuments == '' || modifiedDocuments == null) {
    new window.Notification('Invalid folder', { body: 'The folder you selected has no image files \nAccepted file extentions are: png, jpg/jpeg, webp, tiff, raw, and gif' })
  } else {
    localStorage.setItem('storage_images', JSON.stringify(modifiedDocuments));
    localStorage.setItem('storage_images_path', modifiedPath);

    document.getElementById('imageFilePath').value = modifiedPath
  }
});


ipcRenderer.on('getvideos-reply', (event, modifiedDocuments, modifiedPath) => {
  // Handle the modified documents data here
  console.log('Received array main process: ' + modifiedDocuments[0]);
  console.log('Received flder path main process: ' + modifiedPath);

  if (modifiedDocuments == '' || modifiedDocuments == null) {
    new window.Notification('Invalid folder', { body: 'The folder you selected has no image files \nAccepted file extentions are: mov, mp4, and mkv' })
  } else {
    localStorage.setItem('storage_videos', JSON.stringify(modifiedDocuments));
    localStorage.setItem('storage_videos_path', modifiedPath);

    document.getElementById('videoFilePath').value = modifiedPath
  }
});


ipcRenderer.on('getaudios-reply', (event, modifiedDocuments, modifiedPath) => {
  // Handle the modified documents data here
  console.log('Received array main process: ' + modifiedDocuments[0]);
  console.log('Received flder path main process: ' + modifiedPath);

  if (modifiedDocuments == '' || modifiedDocuments == null) {
    new window.Notification('Invalid folder', { body: 'The folder you selected has no image files \nAccepted file extentions are: mp4, mov, mkv, and mp3' })
  } else {
    localStorage.setItem('storage_audios', JSON.stringify(modifiedDocuments));
    localStorage.setItem('storage_audios_path', modifiedPath);

    document.getElementById('audioFilePath').value = modifiedPath
  }
});

document.addEventListener('DOMContentLoaded', () => {

  // Set up rich presence on start
  if (localStorage.getItem('storage_ifdiscord') == 'true' && document.getElementById('inhome').innerHTML == 'EdgeR') {
    setTimeout(function() {
      sendDiscordSettings()
    }, 100);
  }

  document.getElementById('closeApp').addEventListener('click', () => {
    ipcRenderer.invoke('quit-app');
  });

    // Get prefrences and start displaying popups
  document.getElementById('start').addEventListener('click', () => {

    if (document.getElementById('countInMs').checked) {
      useMs = true
    } else {
      useMs = false
    }

    if (document.getElementById('frequencyToggle').checked) {
      randomFrequency = true
    } else {
      randomFrequency = false
    }

    frequency = document.getElementById('frequency').value
    frequency02 = document.getElementById('frequency02').value
    frequency03 = document.getElementById('frequency03').value

    if (document.getElementById('willCreateImages').checked) {
      imageCreate = true
    } else if (document.getElementById('willCreateVideos').checked || document.getElementById('willCreateAudio').checked) {
      imageCreate = false
    } else {
      imageCreate = true
    }

    if (document.getElementById('willCreateVideos').checked) {
      videoCreate = true
    } else {
      videoCreate = false
    }

    if (document.getElementById('willCreateAudio').checked) {
      audioCreate = true
    } else {
      audioCreate = false
    }

    createType = JSON.parse(localStorage.getItem('storage_creationType'))

    audioDisplay = localStorage.getItem('storage_isAudioHidden')

    minSize = JSON.parse(localStorage.getItem('storage_minimumPopupSize'))
    maxSize = JSON.parse(localStorage.getItem('storage_maximumPopupSize'))

    ipcRenderer.send('updateSettings', frequency, frequency02, frequency03, randomFrequency, useMs, imageCreate, videoCreate, audioCreate, createType, audioDisplay, minSize, maxSize);

    ipcRenderer.invoke('activeOn');
  });


  // Deal with discord stuff
  document.getElementById('sendSettings').addEventListener('click', () => {
    sendDiscordSettings()
  });

  function sendDiscordSettings() {
    doesshow = localStorage.getItem('storage_ifdiscord')

    if (localStorage.getItem('storage_usingDiscordDetails') == 'true') {
      discDetails = localStorage.getItem('storage_detailsText')
    } else {
      discDetails = ' '
    }

    if (localStorage.getItem('storage_usingDiscordState') == 'true') {
      discState = localStorage.getItem('storage_stateText')
    } else {
      discState = ' '
    }
    
    ipcRenderer.send('discordSettings', doesshow, discDetails, discState)
  }

  //Open captions editor thingy
  document.getElementById('opencaptioneditor').addEventListener('click', () => {
    ipcRenderer.invoke('capeditoropen')
    console.log('slap')
  });

  //Check for missing folder paths
  let imagepath = false
  let videopath = false
  let audiopath = false
  document.getElementById('swapbutton').addEventListener('click', () => {

      //Grab whatever was put in each box
      img = localStorage.getItem('image_fp')
      vid = localStorage.getItem('video_fp')
      audi = localStorage.getItem('audio_fp')

      //Check if there are missing file paths
      if (img === null || img === undefined || img === '') {
        imagepath = false
        console.log('run false')
      } else {
        imagepath = true
          console.log('run true: ' + imagepath)
      }
      if (vid === null || vid === undefined || vid === '') {
        videopath = false
        console.log('run false')
      } else {
        videopath = true
          console.log('run true: ' + imagepath)
      }
      if (audi === null || audi === undefined || audi === '') {
        audiopath = false
        console.log('run false')
      } else {
        audiopath = true
          console.log('run true: ' + imagepath)
      }

      //Create the notification message to include only the missing paths

      if (imagepath == true && videopath == true && audiopath == true) {
        //Do nothing
      } else {
        let notificationbody = 'There are no folder paths set for '
        if (imagepath == false) {
          notificationbody += 'Images'
        } 
        if (videopath == false) {
          notificationbody += ', Videos'
        } 
        if (audiopath == false) {
          notificationbody += ', Audio'
        }
        notificationbody += ' if you do not set these whenever one of the those popups is created it will apear as the default image'

        //Create the actual notification
        new window.Notification('Unset file paths', { body: notificationbody })
        .onclick = () => { console.log('Notification clicked') }
      }

  });


  document.getElementById('choose-image-folder').addEventListener('click', () => {
    ipcRenderer.send('getimages');
  });

  document.getElementById('choose-video-folder').addEventListener('click', () => {
    ipcRenderer.send('getvideos');
  });

  document.getElementById('choose-audio-folder').addEventListener('click', () => {
    ipcRenderer.send('getaudios')
  });

  // Just a test command for debugging
  document.getElementById('test').addEventListener('click', () => {
    ipcRenderer.invoke('test');
  });

});
