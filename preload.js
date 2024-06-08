const { ipcRenderer, electron, contextBridge, } = require('electron');
console.log('preloaded script ran')

//Set image array
ipcRenderer.on('getimages-reply', (event, modifiedDocuments, modifiedPath) => {
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

//Set video array
ipcRenderer.on('getvideos-reply', (event, modifiedDocuments, modifiedPath) => {
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

//Set audio array
ipcRenderer.on('getaudios-reply', (event, modifiedDocuments, modifiedPath) => {
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

  // Discord stuff
  if (localStorage.getItem('storage_ifdiscord') == 'true' && document.getElementById('inhome').innerHTML == 'EdgeR') {
    setTimeout(function() {
      sendDiscordSettings()
    }, 100);
  }

  document.getElementById('sendSettings').addEventListener('click', () => {
    sendDiscordSettings()
    ipcRenderer.send('autoStartSettings', localStorage.getItem('storage_startOnOpen'))

    if (localStorage.getItem('storage_lockTray') == 'true') {
      ipcRenderer.send('trayIsLocked', 'e')
    } else {
      ipcRenderer.send('trayIsUnocked', 'e')
    }
  });

  // Send discord settings to main process || Optimized
  function sendDiscordSettings() {
    const doesshow = localStorage.getItem('storage_ifdiscord') || '';

    const discDetails = localStorage.getItem('storage_usingDiscordDetails') === 'true' ?
      localStorage.getItem('storage_detailsText') : '';

    const discState = localStorage.getItem('storage_usingDiscordState') === 'true' ?
      localStorage.getItem('storage_stateText') : '';

    ipcRenderer.send('discordSettings', doesshow, discDetails, discState);
  }

  // Check for unset directories || Optimized
  document.getElementById('swapbutton').addEventListener('click', () => {

    const img = localStorage.getItem('image_fp');
    const vid = localStorage.getItem('video_fp');
    const audi = localStorage.getItem('audio_fp');

    const missingPaths = [];
    if (!img) {
      missingPaths.push('Images');
    }
    if (!vid) {
      missingPaths.push('Videos');
    }
    if (!audi) {
      missingPaths.push('Audio');
    }

    if (missingPaths.length > 0) {
      const notificationBody = `There are no folder paths set for ${missingPaths.join(', ')}. If you do not set these, whenever one of those popups is created, it will appear as the default image.`;

      new window.Notification('Unset file paths', { body: notificationBody })
        .onclick = () => { console.log('Notification clicked'); };
    }
  });


  document.getElementById('closeApp').addEventListener('click', () => {
    localStorage.setItem('storage_hasBeenOpened', 'false')
    ipcRenderer.invoke('quit-app');
  });

  document.getElementById('start').addEventListener('click', () => {
    startEdger();
  });


  // Open dir selector || optimized
  function addEventListenerById(elementId, ipcEvent) {
    document.getElementById(elementId).addEventListener('click', () => {
      ipcRenderer.send(ipcEvent);
    });
  }

  addEventListenerById('opencaptioneditor', 'capeditoropen');
  addEventListenerById('choose-image-folder', 'getimages');
  addEventListenerById('choose-video-folder', 'getvideos');
  addEventListenerById('choose-audio-folder', 'getaudios');

  // Just a test command for debugging
  document.getElementById('test').addEventListener('click', () => {
    firstLockNumber = JSON.parse(localStorage.getItem('storage_lockModeStart'))
    secondLockNumber = JSON.parse(localStorage.getItem('storage_lockModeEnd'))

    

    console.log(firstLockNumber, secondLockNumber)
    //ipcRenderer.invoke('test');
  });
});

 window.addEventListener('load', (event) => {
   setTimeout(() => {
    console.log(localStorage.getItem('storage_startOnOpen'), localStorage.getItem('storage_hasBeenOpened'))
     if (localStorage.getItem('storage_startOnOpen') == 'true' && localStorage.getItem('storage_hasBeenOpened') == 'false') {
      startEdger();
      localStorage.setItem('storage_hasBeenOpened', 'true')
      window.close();
      }
  }, 100)
});

ipcRenderer.on('set-opened-state', () => {
  localStorage.setItem('storage_hasBeenOpened', 'false')
});


function startEdger() {
  if (localStorage.getItem('storage_lockTray') == 'true') {
    ipcRenderer.send('trayIsLocked', 'e')
  } else {
    ipcRenderer.send('trayIsUnocked', 'e')
  }

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

  firstLockNumber = JSON.parse(localStorage.getItem('storage_lockModeStart'))
  secondLockNumber = JSON.parse(localStorage.getItem('storage_lockModeEnd'))

  lockTimeError = "null"

  if (firstLockNumber > 24 || secondLockNumber > 24) {
    lockTimeError = "Cannot be more than 24"
  }

  if (typeof firstLockNumber != 'number' || typeof secondLockNumber != 'number') {
    lockTimeError = "Cannot be a string"
  }

  if (firstLockNumber == secondLockNumber) {
    lockTimeError = "Cannot be the same"
  }

  if (lockTimeError != "null") {
    firstLockNumber = 0
    secondLockNumber = 0
  }

  console.log(firstLockNumber, secondLockNumber)

  ipcRenderer.send('updateSettings', frequency, frequency02, frequency03, randomFrequency, useMs, imageCreate, videoCreate, audioCreate, createType, audioDisplay, minSize, maxSize, firstLockNumber, secondLockNumber);

  ipcRenderer.invoke('activeOn');
}