const { spawn } = require('child_process');
const {app, BrowserWindow, ipcMain, Tray, Menu, Notification, dialog, globalShortcut } = require('electron')
const fs = require('fs');
const path = require('path');

let mainWindow;
let mainWindowOpen = false;
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'EdgR - Splash Screen',
        width: 700,
        height: 800,
        resizable: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'renderer', 'img', 'icon.ico'),

        webPreferences: {
            preload: path.join(__dirname, "indexPreload.js")
        }
    })

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'))
    mainWindowOpen = true;

    mainWindow.on("close", () => {
      console.log("closed");
      mainWindowOpen = false;
    });

    mainWindow.on("minimize", () => {
      mainWindow.webContents.send("minimized")
    })
    mainWindow.on("restore", () => {
      mainWindow.webContents.send("restored")
    })
    mainWindow.on("show", () => {
      mainWindow.webContents.send("shown")
    })
}

let allPopUps = []
let windowsFade = 'true';
let windowFadeTime = 5;

function createImagePopup() {
    const popUpWindow = new BrowserWindow({
        skipTaskbar: true,
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        frame: false,
        autoHideMenuBar: true,
        resizable: false,
        show: false,
        focusable: false,
    })

    popUpWindow.loadFile(path.join(__dirname, "renderer/image.html"))

    popUpWindow.once("ready-to-show", () => {
      popUpWindow.setAlwaysOnTop(true, 'screen-saver')
      popUpWindow.showInactive();
    })

    allPopUps.push(popUpWindow)

    console.log(windowFadeTime)

    if (windowsFade == 'true') {
      setTimeout(() => {
      popUpWindow.destroy()
    }, windowFadeTime * 1000)
    }
}

function createVideoPopup() {
  const popUpWindow = new BrowserWindow({
        skipTaskbar: true,
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        frame: false,
        autoHideMenuBar: true,
        resizable: false,
        show: false,
        focusable: false,
    })

    popUpWindow.loadFile(path.join(__dirname, "renderer/video.html"))

    popUpWindow.once("ready-to-show", () => {
      popUpWindow.setAlwaysOnTop(true, 'screen-saver')
      popUpWindow.showInactive();
    })

    allPopUps.push(popUpWindow)

    if (windowsFade == 'true') {
      setTimeout(() => {
      popUpWindow.destroy()
    }, windowFadeTime * 1000)
    }
}

let limitAudioWindows = 'true'
let amountOfAudioWindows = 0;
function createAudioPopup() {
  const popUpWindow = new BrowserWindow({
        skipTaskbar: true,
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        frame: false,
        autoHideMenuBar: true,
        resizable: false,
        show: false,
        focusable: false,
    })

    popUpWindow.loadFile(path.join(__dirname, "renderer/audio.html"))

    popUpWindow.once("ready-to-show", () => {
      popUpWindow.setAlwaysOnTop(true, 'screen-saver')
      popUpWindow.showInactive();
    })

    allPopUps.push(popUpWindow)

    if (windowsFade == 'true') {
      setTimeout(() => {
        popUpWindow.close()
      }, windowFadeTime * 1000)
    }

    popUpWindow.once("closed", () => {
      amountOfAudioWindows--
    })
}

function createPromptPopup() {
  const popUpWindow = new BrowserWindow({
        skipTaskbar: true,
        x: 0,
        y: 0,
        height: 200,
        width: 200,
        frame: false,
        autoHideMenuBar: true,
        resizable: false,
        show: false,
        focusable: true,

        webPreferences: {
          devTools: true
        }
    })

    popUpWindow.loadFile(path.join(__dirname, "renderer/prompt.html"))

    popUpWindow.once("ready-to-show", () => {
      popUpWindow.setAlwaysOnTop(true, 'screen-saver')
      popUpWindow.show();
    })

    allPopUps.push(popUpWindow)
}

ipcMain.handle('start', () => {
  startGoonLoop()
})

ipcMain.handle('exit', () => {
    app.exit();
})

ipcMain.handle("addNewPath", async(event, type) => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (result.canceled) return null;

  const folderPath = result.filePaths[0];

  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  let images = [];

  let allowedExtentions = ''

  switch (type) {
    case "images":
      allowedExtentions = /\.(png|jpe?g|webp|gif)$/i;
      break;
    case "videos":
      allowedExtentions = /\.(mp4|mkv|mov|wav|avi)$/i;
      break;
    case "audio":
      allowedExtentions = /\.(mp3|mp4|mkv|mov|wav|avi)$/i;
      break;
  }

  let skippedDirs = 0;
  let skippedFiles = 0;

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      console.log('Skipped: ', entry.name, " - Is dir")
      skippedDirs++
      // Recurse into subfolders
      //images = images.concat(getAllImages(fullPath));
    } else if(allowedExtentions.test(entry.name)) {
      // if (/\.(png|webp)$/i.test(entry.name)) {
      //   images.push(fullPath);
      // }
      images.push(fullPath);
    } else {
      console.log('Skipped: ', entry.name, ' - Bad format')
      skippedFiles++
    }
  }

  new Notification({
      title: "Media overlooked",
      body: `Skipped over ${skippedDirs} directories and ${skippedFiles} files that did not meet compatable formats`,
    }).show();

  
  const returnPackage = {
    hostDir: folderPath,
    insides: images,
  };

  console.log(returnPackage);
  return returnPackage;
});

ipcMain.handle('test', () => {
    createImagePopup();
    createVideoPopup();
    createAudioPopup();
    createPromptPopup();
})

const trayTemplate = [
  // {
  //   label: "test",
  //   click: () => {
  //     //createImagePopup();
  //     createVideoPopup();
  //     //createAudioPopup();
  //   },
  // },
  {
    label: "Spash Screen",
    click: () => {
      if (!mainWindowOpen) {
        createMainWindow();
      } else {
        new Notification({
          title: "Splash Screen is already open",
          body: "Multiple instances of splash screen are not supported. Please close the previous window to open a new open.",
        }).show();
      }
    },
  },
  {
    label: "Freeze",
    click: () => {
      clearInterval(mainLoop);
    },
  },
  {
    label: "Resume",
    click: () => {
      startGoonLoop(mainLoop);
    },
  },
  {
    label: "Clear screen",
    click: () => {
      allPopUps.forEach((popup) => {
        if (popup) {
          popup.destroy();
        }
      });
      allPopUps = [];
    },
  },
  {
    label: "Exit",
    click: () => {
      app.exit();
    },
  },
];

app.whenReady().then(() => {
  // const contentFetchMethod = spawn('cmd', ["/c", "contentGrab.bat"], {
  //   stdio: "inherit"
  // })
  
  // contentFetchMethod.on("close", (code) => {
  //   console.log(`Content fetcher exited with code: ${code}`);
  // });

  const tray = new Tray(path.join(__dirname, "renderer/img/icon.ico"))
  tray.setToolTip('EdgR')
  tray.setContextMenu(Menu.buildFromTemplate(trayTemplate))
  createMainWindow();

  globalShortcut.register("Control+Shift+e", () => {
    app.exit();
  });

  globalShortcut.register("Control+Shift+f", () => {
    clearInterval(mainLoop);
  });

  globalShortcut.register("Control+Shift+r", () => {
    startGoonLoop(mainLoop);
  });

  globalShortcut.register("Control+Shift+c", () => {
    allPopUps.forEach((popup) => {
        if (popup) {
          popup.destroy();
        }
      });
      allPopUps = [];
  })
});


app.on("window-all-closed", () => {
  console.log("Running in the background");
});

let randomDonwTime = false;
let downTime = 2;
let maxDownTime = 5;

let imageChance = 100;
let videoChance = 0;
let audioChance = 0;
let promptChance = 0;
let notifcationChance = 0;

let chanceTable = [];

let imageAmount = 1;
let videoAmount = 1;
let audioAmount = 1;
let promptAmount = 1;
let notificationAmount = 1;

ipcMain.handle('setSettings', (event, randomdt, dt, mdt, imgChance, vidChance, audChance, pmtChance, notChance, imgAmount, vidAmount, audAmount, pmtAmount, notAmount, fade, fadeTime, audCap) => {
  if (randomdt) {randomDonwTime = randomdt}
  if (dt) {downTime = dt}
  if (mdt) {maxDownTime = mdt}

  if (imgChance) {imageChance = imgChance}
  if (vidChance) {videoChance = vidChance}
  if (audChance) {audioChance = audChance}
  if (pmtChance) {promptChance = pmtChance}
  if (notChance) {notifcationChance = notChance}

  chanceTable = [
    ["image", imageChance],
    ["video", videoChance],
    ["audio", audioChance],
    ["prompt", promptChance],
    ["notification", notifcationChance],
  ];

  if (imgAmount) {imageAmount = imgAmount}
  if (vidAmount) {videoAmount = vidAmount}
  if (audAmount) {audioAmount = audAmount}
  if (pmtAmount) {promptAmount = pmtAmount}
  if (notAmount) {notificationAmount = notAmount}

  if (fade) {windowsFade = fade}
  if (fadeTime) {windowFadeTime = fadeTime}

  if (audCap) {limitAudioWindows = audCap}

  console.log(imageChance, videoChance, audioChance)
});






let mainLoop;
function startGoonLoop() {
  createMedia();

  mainLoop = setInterval(() => {

    if (randomDonwTime === 'true') {
      const wait = Math.floor(Math.random() * maxDownTime)
      console.log('Random run')

      setTimeout(() => {
        createMedia();
      }, wait * 1000)

    } else {
      createMedia();
    }
    
  }, downTime * 1000);

  console.log('Doawn Time: ' + downTime)
}

function createMedia() {

  chanceTable.forEach((item) => {
    const rng = Math.floor(Math.random() * 100);
    let passed = false;
    if (rng < item[1]) {
      passed = true
      switch (item[0]) {
        case 'image':
          for (let i = 0; i < imageAmount; i++) {
            createImagePopup();
          }
        break;
        case 'video':
          for (let i = 0; i < videoAmount; i++) {
            createVideoPopup();
          }
        break;
        case 'audio':
          if (limitAudioWindows == 'true' && amountOfAudioWindows > 1) {
            return;
          } else {
            for (let i = 0; i < audioAmount; i++) {
              createAudioPopup();
              amountOfAudioWindows++
            }
          }
        break;
        case 'prompt':
          for (let i = 0; i < promptAmount; i++) {
            createPromptPopup();
          }
        break;
        case 'notification':
          for (let i = 0; i < notificationAmount; i++) {
            console.log('hi')
            new Notification({
              title: 'Notification',
              body: 'This is a test notification from the main process'
            }).show()
          }
        break;
      }
    }

    console.log(`${item[0]}: Passed = ${passed} | Pass chance = ${item[1]} | RNG value = ${rng}`)
  });
}