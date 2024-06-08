const { app, ipcMain, Menu, Tray, BrowserWindow, screen, dialog, globalShortcut, powerSaveBlocker} = require('electron');
const Store = require('electron-store');
const path = require('path');
const fs = require('fs');

// Get rid of the default menu at the top of all windows
Menu.setApplicationMenu(false);

// Quit this instance of edger if edger is already running
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let win

// Configuration for windows
function createWindow() {
     win = new BrowserWindow({
        width: 700,
        height: 800,
        //frame: false,
        resizable: false,
        icon: path.join(__dirname, 'src/img/trayIcon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            //devTools: true
        }
    });

    const id = powerSaveBlocker.start('prevent-app-suspension');

    win.loadFile('src/index.html');
}

ipcMain.handle('capeditoropen', () => {
    const win6 = new BrowserWindow({
        width: 600,
        height: 700,
        //frame: false,
        resizable: false,
        icon: path.join(__dirname, 'src/img/trayIcon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            //devTools: true
        }
    });

    win6.loadFile('src/caption-editor.html');
});

function createImageWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const scale = Math.floor(Math.random() * popupMaxSize) + popupMinSize;

    const windowWidth = scale;
    const windowHeight = scale;

    const maxWidth = width - windowWidth;
    const maxHeight = height - windowHeight;

    const positionX = Math.floor(Math.random() * maxWidth);
    const positionY = Math.floor(Math.random() * maxHeight);

    const win2 = new BrowserWindow({
        width: scale,
        height: scale,
        x: positionX,
        y: positionY,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'popup-preload.js'),
            devTools: false
        }
    });

    win2.loadFile('src/image.html');

    win2.on('minimize', () => {
        win2.restore();
    });
}

function createVideoWindow() {

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const scale = Math.floor(Math.random() * popupMaxSize) + popupMinSize;

    const windowWidth = scale;
    const windowHeight = scale;

    const maxWidth = width - windowWidth;
    const maxHeight = height - windowHeight;

    const positionX = Math.floor(Math.random() * maxWidth);
    const positionY = Math.floor(Math.random() * maxHeight);
    

    const win3 = new BrowserWindow({
        width: scale,
        height: scale,
        x: positionX,
        y: positionY,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'popup-preload.js'),
            devTools: false
        }
    });

    // Load the image file
    win3.loadFile('src/video.html');

    // When minimized, immediately restore the window
    win3.on('minimize', () => {
        win3.restore();
    });
}

function createAudioWindow() {

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const scale = Math.floor(Math.random() * popupMaxSize) + popupMinSize;

    const windowWidth = scale;
    const windowHeight = scale;

    const maxWidth = width - windowWidth;
    const maxHeight = height - windowHeight;

    const positionX = Math.floor(Math.random() * maxWidth);
    const positionY = Math.floor(Math.random() * maxHeight);
    

    const win4 = new BrowserWindow({
        width: scale,
        height: scale,
        x: positionX,
        y: positionY,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        show: showaudio,
        webPreferences: {
            preload: path.join(__dirname, 'popup-preload.js'),
            devTools: false
        }
    });

    win4.loadFile('src/audio.html');

    // When minimized, immediately restore the window
    win4.on('minimize', () => {
        win4.restore();
    });
}

let win5

function createblockedWindow() {

    win5 = new BrowserWindow({
        kiosk: true,
        frame: false,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'popup-preload.js'),
            devTools: false
        }
    });

    win5.loadFile('src/blocked.html');

    // Must be set here because otherwise the taskbar is visible with kiosk
    win5.setAlwaysOnTop(true);

    // When minimized, immediately restore the window
    win5.on('minimize', () => {
        win5.restore();
    });
}

let win7

let noPass = false
ipcMain.on('userHasNoPass', (choice) => {
    noPass = true
    console.log(noPass)
})

function createpasswordwindow(type) {

    win7 = new BrowserWindow({
        //kiosk: true,
        //frame: false,
        width: 600,
        height: 700,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'pass-preload.js'),
            //devTools: false
        }
    });

    win7.loadFile('src/password.html');

    // Must be set here because otherwise the taskbar is visible with kiosk
    win7.setAlwaysOnTop(true);

    // When minimized, immediately restore the window 
    win7.on('minimize', () => {
        win7.restore();
    });

    win7.on('closed', () => {
        if (noPass == false) {
            switch(type) {
                case 'Splash':
                    createWindow()
                break;
                case 'Freeze':
                    clearInterval(clock)    
                break;
                case 'Resume':
                    clearInterval(clock)
                    startClock()
                break;
                case 'Clear':
                    let windows = BrowserWindow.getAllWindows();
                    windows.forEach(window => {
                        if (window !== win) { // Avoid closing the main window
                        window.close();
                        }
                    });
                break;
                case 'Quit':
                    quitEdgeR()
                break;
            }
        } else {
            noPass = false;
        }
    })
}


// Open splash screen on launch, build tray options, and set up hotkeys
app.whenReady().then(() => {
    createWindow();

    let tray;
    tray = new Tray(path.join(__dirname, 'src', 'img', 'trayIcon.ico'));
    tray.setToolTip('EdgeR');
    let trayTemplate = [
        {
            label: 'Splash screen',
            click: () => {
                if (trayLock == true) {createpasswordwindow('Splash')} else {createWindow()}
            }
        },
        { 
            label: 'Freeze' ,
            click: () => {
                if (trayLock == true) {createpasswordwindow('Freeze')} else {clearInterval(clock)}
            }
        },
        { 
             label: 'Resume' ,
             click: () => {
                if (trayLock == true) {createpasswordwindow('Resume')} else {clearInterval(clock), startClock()}
                
             }
        },
        { 
            label: 'Clear screen' ,
            click: () => {
                if (trayLock == true) {createpasswordwindow('Clear')} else {
                    let windows = BrowserWindow.getAllWindows();
                    windows.forEach(window => {
                        if (window !== win) { // Avoid closing the main window
                        window.close();
                        }
                    });
                } 
            }
        },
        {
            label: 'Quit',
            click: () => {
                if (trayLock == true) {createpasswordwindow('Quit')} else {quitEdgeR()}
                
             }
        }
    ];

    let contextMenu = Menu.buildFromTemplate(trayTemplate);
    tray.setContextMenu(contextMenu);

    globalShortcut.register('F11', () => {
        console.log('Full screen is disabled');
    });
    globalShortcut.register('ALT + P', () => {
        let windows = BrowserWindow.getAllWindows();
        windows.forEach(window => {
            if (window !== win) { // Avoid closing the main window
            window.close();
            }
        });
    });
});

let trayLock = false

ipcMain.on('trayIsLocked', (choice) => {
    trayLock = true
})

ipcMain.on('trayIsUnocked', (choice) => {
    trayLock = false
})

// Place and remove EdgeR from startup folder
ipcMain.on('autoStartSettings', (choice) => {
    const appPath = app.getPath('exe');
    const appName = path.basename(appPath);
    const startupFolderPath = path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
    const shortcutPath = path.join(startupFolderPath, `${appName}.lnk`);

    if (!fs.existsSync(shortcutPath)) {
        const shell = require('electron').shell;
        shell.writeShortcutLink(shortcutPath, 'create', {
          target: appPath,
          args: '',
          description: 'EdgeR',
          icon: "src/img/icon.ico",
        });
    
        if (choice === 'true') {
            Store.set('autoStart', true);
        } else {
            Store.set('autoStart', false);
        }
    }
})

// Make sure EdgeR isnt auto closed when no windows are open
app.on('window-all-closed', () => {
});

// Handle the quit button in index.html
ipcMain.handle('quit-app', () => {
    quitEdgeR();
});

// Unregister all shortcuts, make sure start on open is not blocked, and quit the app
function quitEdgeR() {
    console.log('sd')
    globalShortcut.unregisterAll();
    //powerSaveBlocker.stop(id);
    const allWebContents = BrowserWindow.getAllWindows().map(win => win.webContents);
    allWebContents.forEach(webContents => {
        webContents.send('set-opened-state');
    });
    app.quit();
}

// Open and recieve image folder
ipcMain.on('getimages', (event) => {
    console.log('arrived')

    dialog.showOpenDialog({
        properties: ['openDirectory'],
    }).then((result) => {
        if (!result.canceled) {
            const folderPath = result.filePaths[0]; // Get the selected folder path

            // Now, you can read the folder and filter out documents
            fs.readdir(folderPath, (err, files) => {
                if (err) {
                    console.error('Error reading folder:', err);
                    return;
                }

                const documents = files.filter((file) => {
                    // You can adjust this filter to include the file types you consider as documents.
                    return file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.webp') || file.endsWith('.gif') || file.endsWith('.tiff') || file.endsWith('.raw');
                });

                //console.log(documents);
                //console.log(reply)

                event.sender.send('getimages-reply', documents, folderPath);
            });
        } else {
            console.log('Canceled images')
        }
    });
});

// Open and recieve video folder
ipcMain.on('getvideos', (event) => {
    console.log('arrived')

    dialog.showOpenDialog({
        properties: ['openDirectory'],
    }).then((result) => {
        if (!result.canceled) {
            const folderPath = result.filePaths[0]; // Get the selected folder path

            // Now, you can read the folder and filter out documents
            fs.readdir(folderPath, (err, files) => {
                if (err) {
                    console.error('Error reading folder:', err);
                    return;
                }

                const documents = files.filter((file) => {
                    // You can adjust this filter to include the file types you consider as documents.
                    return file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.mkv');
                });

                //console.log(documents);
                //console.log(reply)

                event.sender.send('getvideos-reply', documents, folderPath);
            });
        } else {
            console.log('Canceled videos')
        }
    });
});

// Open and recieve audio folder
ipcMain.on('getaudios', (event) => {
    console.log('arrived')

    dialog.showOpenDialog({
        properties: ['openDirectory'],
    }).then((result) => {
        if (!result.canceled) {
            const folderPath = result.filePaths[0]; // Get the selected folder path

            // Now, you can read the folder and filter out documents
            fs.readdir(folderPath, (err, files) => {
                if (err) {
                    console.error('Error reading folder:', err);
                    return;
                }

                const documents = files.filter((file) => {
                    // You can adjust this filter to include the file types you consider as documents.
                    return file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.mkv') || file.endsWith('.mp3');
                });

                //console.log(documents);
                //console.log(reply)

                event.sender.send('getaudios-reply', documents, folderPath);
            });
        } else {
            console.log('Canceled audio')
        }
    });
});






// Get and apply chosen settings + loop that creates the popups
let clock
var timer = 1000
var randtimer01
var randtimer02
var randomtime
var countInMs

var images
var videos
var audio

var createAmount
var showaudio

ipcMain.handle('activeOn', () => {
    clearInterval(clock)

    if (randomtime == true) {
        temp = Math.floor(Math.random() * (parseInt(randtimer02) - parseInt(randtimer01) + 1)) + parseInt(randtimer01);

        if (countInMs == false) {
            timer = temp * 1000
        }
        console.log('Time before next popup: ' + timer)
    }

    switch (createAmount) {
        case 3:
            if (images == true) {
                createImageWindow()
            }
            if (videos == true) {
                createVideoWindow()
            }
            if (audio == true) {
                createAudioWindow()
            }
        break;
        case 1:
            temp2 = Math.floor(Math.random() * 3) + 1
            switch (temp2) {
                case 1:
                    if (images == true) {
                        createImageWindow()
                    }
                    if (images == false && videos == true) {
                        createVideoWindow()
                    }
                    if (images == false && videos == false) {
                        createAudioWindow()
                    }
                break;
                case 2:
                    if (videos == true) {
                        createVideoWindow()
                    }
                    if (videos == false && images == true) {
                        createImageWindow()
                    }
                    if (videos == false && images == false) {
                        createAudioWindow()
                    }
                break;
                case 3:
                    if (audio == true) {
                        createAudioWindow()
                    }
                    if (audio == false && images == true) {
                        createImageWindow()
                    }
                    if (audio == false && images == false) {
                        createVideoWindow()
                    }
                break;
            }
        break;
        default:
            tempar = []
            if (images == true) {
                tempar.push('images')
            }
            if (videos == true) {
                tempar.push('videos')
            }
            if (audio == true) {
                tempar.push('audio')
            }

            for (let i = 0; i < createAmount; i++) {
                temp3 = tempar[Math.floor(Math.random() * tempar.length)]
                switch (temp3) {
                    case 'images':
                        createImageWindow()
                    break;
                    case 'videos':
                        createVideoWindow()
                    break;
                    case 'audio':
                        createAudioWindow()
                    break;
                }
            }
        break;
    }

    startClock()
});

var popupMinSize
var popupMaxSize

ipcMain.on('updateSettings', (event, frequency, frequency02, frequency03, randomFrequency, useMs, imageCreate, videoCreate, audioCreate, createType, audioDisplay, minSize, maxSize, firstLockNumber, secondLockNumber) => {
    if (useMs == false) {
        timer = frequency * 1000;
    } else {
        timer = frequency
    }
    randtimer01 = frequency02
    randtimer02 = frequency03
    randomtime = randomFrequency
    countInMs = useMs

    images = imageCreate
    videos = videoCreate
    audio = audioCreate
    popupMinSize = minSize
    popupMaxSize = maxSize

    lockOutStart = firstLockNumber
    lockOutEnd = secondLockNumber

    if (audioDisplay == 'true') {
        showaudio = false
    } else {
        showaudio = true
    }

    createAmount = createType
    console.log('Updated settings: \nFrequency: ', timer + '\nImages: ' + imageCreate + '\nVideos: ' + videoCreate + '\nAudio: ' + audioCreate + '\nAmount to create: ' + createType + '\nMin size: ' + minSize + '\nMax size: ' + maxSize);
    console.log(lockOutStart, lockOutEnd)

    // const uninstallExePath = path.join(__dirname, 'Uninstall edger.exe');

    // if (fs.existsSync(uninstallExePath)) {
    // fs.unlink(uninstallExePath, (err) => {
    //     if (err) {
    //     console.error('Error removing uninstall.exe:', err);
    //     } else {
    //     console.log('uninstall.exe removed successfully!');
    //     }
    // });
    // }
});

function getCurrentTime() {
    return new Date().getHours();
    //return new Date().toLocaleTimeString();
  }
  

let clock02

let lockOutStart
let lockOutEnd
lockedOut = false

function startClock02() {
    // if (lockOutEnd == 0 && lockOutEnd == 0) {
    //     console.log("Lcok error")
    // } else {
    //     clock02 = setInterval(function () {
    //         x = getCurrentTime()

    //         if (lockedOut == false) {
    //             if (x <= lockOutEnd || x >= lockOutStart) {
    //                 console.log('Current time ' + x);
    //                 console.log('Lock starts at ' + lockOutStart)
    //                 createblockedWindow()
    //                 lockedOut = true
    //             }
    //         }

    //         // if (lockedOut == true) {
    //         //     if (x >= lockOutEnd && x <= lockOutStart) {
    //         //         console.log('cosed')
    //         //         //win5.close();
    //         //         lockedOut = false
    //         //     }
    //         // }
    //     }, 1000)
    // }
    
}

startClock02()

function startClock() {
    clock = setInterval( function() {

        switch (createAmount) {
            case 3:
                if (images == true) {
                    createImageWindow()
                }
                if (videos == true) {
                    createVideoWindow()
                }
                if (audio == true) {
                    createAudioWindow()
                }
            break;
            case 1:
                temp2 = Math.floor(Math.random() * 3) + 1
                switch (temp2) {
                    case 1:
                        if (images == true) {
                            createImageWindow()
                        }
                        if (images == false && videos == true) {
                            createVideoWindow()
                        }
                        if (images == false && videos == false) {
                            createAudioWindow()
                        }
                    break;
                    case 2:
                        if (videos == true) {
                            createVideoWindow()
                        }
                        if (videos == false && images == true) {
                            createImageWindow()
                        }
                        if (videos == false && images == false) {
                            createAudioWindow()
                        }
                    break;
                    case 3:
                        if (audio == true) {
                            createAudioWindow()
                        }
                        if (audio == false && images == true) {
                            createImageWindow()
                        }
                        if (audio == false && images == false) {
                            createVideoWindow()
                        }
                    break;
                }
            break;
            default:
                tempar = []
                if (images == true) {
                    tempar.push('images')
                }
                if (videos == true) {
                    tempar.push('videos')
                }
                if (audio == true) {
                    tempar.push('audio')
                }
    
                for (let i = 0; i < createAmount; i++) {
                    temp3 = tempar[Math.floor(Math.random() * tempar.length)]
                    switch (temp3) {
                        case 'images':
                            createImageWindow()
                        break;
                        case 'videos':
                            createVideoWindow()
                        break;
                        case 'audio':
                            createAudioWindow()
                        break;
                    }
                }
            break;
        }

        if (randomtime == true) {
            temp = Math.floor(Math.random() * (parseInt(randtimer02) - parseInt(randtimer01) + 1)) + parseInt(randtimer01);
            if (countInMs == false) {
                timer = temp * 1000
                console.log('Time before next popup: ' + timer)
            }
            clearInterval(clock)
            startClock()
        }
    }, timer)
}


ipcMain.handle('openNewWindow', () => {
    switch (createAmount) {
        case 3:
            if (images == true) {
                createImageWindow()
            }
            if (videos == true) {
                createVideoWindow()
            }
            if (audio == true) {
                createAudioWindow()
            }
        break;
        case 1:
            temp2 = Math.floor(Math.random() * 3) + 1
            switch (temp2) {
                case 1:
                    if (images == true) {
                        createImageWindow()
                    }
                    if (images == false && videos == true) {
                        createVideoWindow()
                    }
                    if (images == false && videos == false) {
                        createAudioWindow()
                    }
                break;
                case 2:
                    if (videos == true) {
                        createVideoWindow()
                    }
                    if (videos == false && images == true) {
                        createImageWindow()
                    }
                    if (videos == false && images == false) {
                        createAudioWindow()
                    }
                break;
                case 3:
                    if (audio == true) {
                        createAudioWindow()
                    }
                    if (audio == false && images == true) {
                        createImageWindow()
                    }
                    if (audio == false && images == false) {
                        createVideoWindow()
                    }
                break;
            }
        break;
        default:
            tempar = []
            if (images == true) {
                tempar.push('images')
            }
            if (videos == true) {
                tempar.push('videos')
            }
            if (audio == true) {
                tempar.push('audio')
            }

            for (let i = 0; i < createAmount; i++) {
                temp3 = tempar[Math.floor(Math.random() * tempar.length)]
                switch (temp3) {
                    case 'images':
                        createImageWindow()
                    break;
                    case 'videos':
                        createVideoWindow()
                    break;
                    case 'audio':
                        createAudioWindow()
                    break;
                }
            }
        break;
    }
});

// This is a command that I used for debugging its connected to a button in index.html thats commented out
ipcMain.handle('test', () => {
    for (let i = 0; i < 1; i++) {
        //createVideoWindow()
        //createImageWindow()
        //createAudioWindow()

        //createblockedWindow()
        createpasswordwindow()
    }
});



//Deal with discord rich presence 
const clientId = '1162831890051514401';
const DiscordRPC = require('discord-rpc');
const RPC = new DiscordRPC.Client({ transport: 'ipc'});

var discordDetails
var discordState

DiscordRPC.register(clientId);

async function setActivity() {
    //console.log('Setting actuvity')
    RPC.setActivity({
        details: discordDetails,
        state: discordState,
        startTimestamp: Date.now(),
        largeImageKey: 'default',
        //largeImageText: 'Random image',
        //smallImageKey: 'default',
        //smallImageText: 'Other random image',
        instance: false,
        // buttons: [
        //     {
        //         label: `Button01`,
        //         url: ``
        //     },
        //     {
        //         label: `Button02`,
        //         url: ``
        //     },
        // ]
    });
};

ipcMain.on('discordSettings', (event, display, discDetails, discState) => {
    discordDisplay = display
    discordDetails = discDetails
    discordState = discState
    if (discordDisplay == 'true') {
        setActivity()
    } else {
        RPC.clearActivity();
    }
});

RPC.on('ready', async () => {
    setActivity()
})

RPC.login({ clientId }).catch(err => console.error(err))