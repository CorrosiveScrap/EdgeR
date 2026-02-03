const { ipcRenderer } = require("electron");

document.addEventListener('DOMContentLoaded', () => {
  const menuPage = document.getElementById("menu");
  const settingsPage = document.getElementById("settings");
  const extraPage = document.getElementById("extra");
  const fullVersionPage = document.getElementById("fullVersion");
  const tint = document.getElementById("bodyTint");

  document
    .getElementById("menu")
    .querySelectorAll("button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        menuButtonClick(button.innerHTML.toLowerCase());
      });

      const menuButtonHoverSE = new Audio("aud/menuButtonHover02.mp3");
      menuButtonHoverSE.volume = 0.3;
      button.addEventListener("mouseover", () => {
        menuButtonHoverSE.play();
      });
    });

  const menuButtonClickSE = new Audio("aud/menuTransition01.mp3");
  menuButtonClickSE.volume = 0.3;

  async function menuButtonClick(button) {
    switch (button) {
      case "start":
        await sendSettingsPackage()
        ipcRenderer.invoke("start");
        break;
      case "settings":
        menuButtonClickSE.play();
        document.body.replaceChildren();
        document.body.appendChild(settingsPage);
        document.getElementById("catagoryHolder").children[0].click();
        document.body.appendChild(tint);
        break;
      case "extra":
        menuButtonClickSE.play();
        document.body.replaceChildren();
        document.body.appendChild(extraPage);
        document.body.appendChild(tint);
        break;
      case "full version":
        menuButtonClickSE.play();
        document.body.replaceChildren();
        document.body.appendChild(fullVersionPage);
        document.body.appendChild(tint);
        break;
      case "exit":
        ipcRenderer.invoke("exit");
        break;
      default:
        console.log("No button handler found");
        break;
    }
  }

  const bgmTracks = ["aud/bgm01.mp3", "aud/bgm02.mp3", "aud/bgm03.mp3"];
  let playingBgm;
  let bgmMute = false
  function selectBackgroundMusic() {
    playingBgm = new Audio(
      bgmTracks[Math.floor(Math.random() * bgmTracks.length)]
    );
    playingBgm.volume = 0.3;
    playingBgm.play();

    playingBgm.addEventListener("ended", () => {
      selectBackgroundMusic();
    });
  }

  document.getElementById('muteMusic').addEventListener('change', () => {
    if (bgmMute == false) {
      playingBgm.pause()
      bgmMute = true
    } else {
      playingBgm.play()
      bgmMute = false
    }
  })

  const menuSE = [
    "aud/menuSound01.mp3",
    "aud/menuSound02.mp3",
    "aud/menuSound03.mp3",
    "aud/menuSound04.mp3",
  ];
  function playMenuSE() {
    const currentSE = new Audio(
      menuSE[Math.floor(Math.random() * menuSE.length)]
    );
    currentSE.volume = 0.2;
    currentSE.play();
  }

  let menuSeChance = 10;
  setInterval(() => {
    if (menuSeChance > Math.floor(Math.random() * 100)) {
      playMenuSE();
      menuSeChance = 10;
    } else {
      menuSeChance += 20;
    }
  }, 8000);

  selectBackgroundMusic();

  ipcRenderer.on("minimized", () => {
    thermalPresure = false;
  })
  ipcRenderer.on("restored", () => {
    thermalPresure = true;
  })

  let thermalPresure = true;
  let shootingStars = [];

  setInterval(() => {
    if (thermalPresure) {
      for (i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
      createShootingStar();
    }
    }
  }, 2500);

  document.getElementById("killStars").addEventListener('change', () => {
    if (thermalPresure) {
      thermalPresure = false
    } else {
      thermalPresure = true
    }
  })

  function createShootingStar() {
    const star = document.createElement("div");
    star.classList.add("shootingStar");
    star.innerHTML = "★";
    star.style.left = window.innerWidth + "px";
    star.style.top = -800 + Math.floor(Math.random() * (window.innerHeight + 800)) + "px";
    star.style.zIndex = -Math.floor(Math.random() * 2);
    star.style.fontSize = Math.floor(Math.random() * 100) + 25 + "px";
    shootingStars.push(star);
    document.body.appendChild(star);
  }

  function moveStars() {
    shootingStars.forEach((star, index) => {
      star.style.left = parseInt(star.style.left) - 1 + "px";
      star.style.top = parseInt(star.style.top) + 1 + "px";

      if (parseInt(star.style.left) < -100) {
        star.remove();
        shootingStars.splice(index, 1);
      }
    });
    requestAnimationFrame(moveStars);
  }

  requestAnimationFrame(moveStars);

  let currentSelectedSettingsButton;
  document
    .getElementById("catagoryHolder")
    .querySelectorAll("button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.add("selectedCatagotyButton");
        currentSelectedSettingsButton = button;
        settingsButtonsClick(button.innerHTML.toLowerCase());
      });
    });

  function settingsButtonsClick(button) {
    document
      .getElementById("catagoryHolder")
      .querySelectorAll("button")
      .forEach((button) => {
        if (button.innerHTML != currentSelectedSettingsButton.innerHTML) {
          button.classList.remove("selectedCatagotyButton");
        }
      });

    let idOfPage;
    switch (button) {
      case "popups":
        idOfPage = "popups";
        break;
      case "interval":
        idOfPage = "interval";
        break;
      case "placement":
        idOfPage = "placement";
        break;
      case "overlays":
        idOfPage = "overlays";
        break;
      case "captions":
        idOfPage = "captions";
        break;
      case "files":
        idOfPage = "files";
        showFilePaths(document.getElementById("pathConfigSelector").value);
        break;
      case "prompts":
        idOfPage = "prompts";
        break;
      case "discord":
        idOfPage = "discord";
        break;
      case "hotkeys":
        idOfPage = "hotkeys";
        break;
      case "client":
        idOfPage = "client";
        break;
      case "debug":
        idOfPage = "debug";
        break;
      default:
        console.log(
          "Could not find settings catagory, default case triggered."
        );
        idOfPage = "popups";
        break;
    }

    document
      .getElementById("settingHolder")
      .querySelectorAll(".settingPage")
      .forEach((div) => {
        div.style.display = "none";
      });

    document.getElementById(idOfPage).style.display = "block";
  }

  document.querySelectorAll(".menuButton").forEach((button) => {
    button.addEventListener("click", () => {
      document.body.replaceChildren();
      document.body.appendChild(menuPage);
      document.body.appendChild(tint);
    });
  });

  document
    .getElementById("saveSettingsButton")
    .addEventListener("click", async () => {
      await saveSettings();
      document.querySelector(".menuButton").click();
    });

  //SETTINGS SCROLL LOGIC
  const scroller = document.getElementById("catagoryHolder");
  let isDown = false;
  let startX;
  let scrollLeft;

  scroller.addEventListener("mousedown", (e) => {
    isDown = true;
    scroller.classList.add("active");
    startX = e.pageX - scroller.offsetLeft;
    scrollLeft = scroller.scrollLeft;
  });
  scroller.addEventListener("mouseleave", () => {
    isDown = false;
    scroller.classList.remove("active");
  });
  scroller.addEventListener("mouseup", () => {
    isDown = false;
    scroller.classList.remove("active");
  });
  scroller.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startX) * 1.5;
    scroller.scrollLeft = scrollLeft - walk;
  });

  //Settings scroll logic

  let imageTitles = [];
  let images = [];

  let videoTitles = [];
  let videos = [];

  let audioTitles = [];
  let audio = [];

  document
    .getElementById("pathConfigSelector")
    .addEventListener("change", () => {
      showFilePaths(document.getElementById("pathConfigSelector").value);
    });

  function showFilePaths(type) {
    let requestedPaths = [];
    switch (type) {
      case "images":
        requestedPaths = imageTitles;
        break;
      case "videos":
        requestedPaths = videoTitles;
        break;
      case "audio":
        requestedPaths = audioTitles;
        break;
      default:
        console.log("ERROR");
        return;
    }

    document.getElementById("pathsDisplay").replaceChildren();

    requestedPaths.forEach((path, index) => {
      const pathModule = document.createElement("p");

      const pathModuleButton = document.createElement("button");
      pathModuleButton.innerHTML = "-";
      //pathModuleButton.classList.add("dropPathButton");

      pathModuleButton.addEventListener("click", () => {
        switch (document.getElementById("pathConfigSelector").value) {
          case "images":
            imageTitles.splice(index, 1);
            images.splice(index, 1);

            localStorage.setItem("imageTitles", JSON.stringify(imageTitles));
            localStorage.setItem("images", JSON.stringify(images));
            break;
          case "videos":
            videoTitles.splice(index, 1);
            videos.splice(index, 1);

            localStorage.setItem("videoTitles", JSON.stringify(videoTitles));
            localStorage.setItem("videos", JSON.stringify(videos));
            break;
          case "audio":
            audioTitles.splice(index, 1);
            audio.splice(index, 1);

            localStorage.setItem("audioTitles", JSON.stringify(audioTitles));
            localStorage.setItem("audio", JSON.stringify(audio));
            break;
          default:
            console.log("ERROR");
            return;
        }

        showFilePaths(document.getElementById("pathConfigSelector").value);
      });

      pathModule.appendChild(pathModuleButton);

      const pathModuleText = document.createElement("span");
      pathModuleText.innerHTML = path;
      pathModuleText.style.display = "inline";
      pathModule.appendChild(pathModuleText);

      document.getElementById("pathsDisplay").appendChild(pathModule);
    });
  }

  //Add new path
  document.getElementById("addNewPath").addEventListener("click", async () => {
    const folderData = await ipcRenderer.invoke("addNewPath", document.getElementById("pathConfigSelector").value);

    console.log(folderData.hostDir)

    switch (document.getElementById("pathConfigSelector").value) {
      case "images":
        imageTitles.push(folderData.hostDir);
        images.push(folderData.insides);

        localStorage.setItem("imageTitles", JSON.stringify(imageTitles));
        localStorage.setItem("images", JSON.stringify(images));
        break;
      case "videos":
        videoTitles.push(folderData.hostDir);
        videos.push(folderData.insides);

        localStorage.setItem("videoTitles", JSON.stringify(videoTitles));
        localStorage.setItem("videos", JSON.stringify(videos));
        break;
      case "audio":
        audioTitles.push(folderData.hostDir);
        audio.push(folderData.insides);

        localStorage.setItem("audioTitles", JSON.stringify(audioTitles));
        localStorage.setItem("audio", JSON.stringify(audio));
        break;
      default:
        console.log("ERROR");
        return;
    }

    showFilePaths(document.getElementById("pathConfigSelector").value);
  });


  document.getElementById('removeAllPaths').addEventListener('click', () => {
    switch (document.getElementById("pathConfigSelector").value) {
      case "images":
        imageTitles = [];
        images = [];

        localStorage.setItem("imageTitles", JSON.stringify(imageTitles));
        localStorage.setItem("images", JSON.stringify(images));
        break;
      case "videos":
        videoTitles = [];
        videos = [];

        localStorage.setItem("videoTitles", JSON.stringify(videoTitles));
        localStorage.setItem("videos", JSON.stringify(videos));
        break;
      case "audio":
        audioTitles = [];
        audio = [];

        localStorage.setItem("audioTitles", JSON.stringify(audioTitles));
        localStorage.setItem("audio", JSON.stringify(audio));
        break;
      default:
        console.log("ERROR");
        return;
    }
    showFilePaths(document.getElementById("pathConfigSelector").value);
  })


  let secondDowntimeNumberVis = false
  document.getElementById("setting_randomDowntimeToggle").addEventListener("change", () => {
    secondDownTimeToggle()
  });

  function secondDownTimeToggle() {
    if (secondDowntimeNumberVis == false) {
      document.getElementById("setting_secondDowntimeNumberVis").style.display =
        "inLine";
        secondDowntimeNumberVis = true;
    } else {
      document.getElementById("setting_secondDowntimeNumberVis").style.display =
        "none";
        secondDowntimeNumberVis = false;
    }
  }


  let captionList = ['Type a caption in the box above and click add to have it appear on popups!']

  document.getElementById('setting_addCaption').addEventListener('click', () => {
    captionList.push(document.getElementById('setting_newCaption').value)
    document.getElementById('setting_newCaption').value = ''
    buildVisualCaptionList()
  })

  function buildVisualCaptionList() {
    document.getElementById('captionHolder').replaceChildren()

    captionList.forEach((caption, index) => {
      const newCaptionElement = document.createElement('p')
      newCaptionElement.innerHTML = caption

      const newCaptionElementButton = document.createElement('button')
      newCaptionElementButton.innerHTML = 'X'

      newCaptionElementButton.addEventListener('click', () => {
        newCaptionElement.remove()
        newCaptionElementButton.remove()
        captionList.splice(index, 1)
        console.log(captionList)
        buildVisualCaptionList()
      })

      newCaptionElement.appendChild(newCaptionElementButton)

      document.getElementById('captionHolder').appendChild(newCaptionElement)
    })
  }






  //Visual changes
  document.getElementById("addOverlayPercent").addEventListener('input', () => {
    const val = document.getElementById("addOverlayPercent").value
    editVisualDisplays("addOverlayText", "Add overlay ", val, "%")
  })

  document.getElementById("addCaptionPercent").addEventListener('input', () => {
    const val = document.getElementById("addCaptionPercent").value
    editVisualDisplays("addCaptionText", "Add caption ", val, "%")
  })

  document.getElementById("addCloseButtonPercent").addEventListener('input', () => {
    const val = document.getElementById("addCloseButtonPercent").value
    editVisualDisplays("addCloseButtonText", "Add close button ", val, "%")
  })

  document.getElementById("overlayOpacityPercent").addEventListener('input', () => {
    const val = document.getElementById("overlayOpacityPercent").value
    editVisualDisplays("overlayOpacityText", "Overlay opacity ", val, "%")
  })

  document.getElementById("captionOpacityPercent").addEventListener('input', () => {
    const val = document.getElementById("captionOpacityPercent").value
    editVisualDisplays("captionOpcatityText", "Caption opacity ", val, "%")
  })

  document.getElementById("popupMaxSizePercent").addEventListener('input', () => {
    const val = document.getElementById("popupMaxSizePercent").value
    editVisualDisplays("popupMaxSizeText", "Max size: ", val, "")
  })

  document.getElementById("popupMinSizePercent").addEventListener('input', () => {
    const val = document.getElementById("popupMinSizePercent").value
    editVisualDisplays("popupMinSizeText", "Min size: ", val, "")
  })

  document.getElementById("createImageChance").addEventListener('input', () => {
    const val = document.getElementById("createImageChance").value
    editVisualDisplays("imageChanceText", "Create Image ", val, "%")
  })

  document.getElementById("createVideoChance").addEventListener('input', () => {
    const val = document.getElementById("createVideoChance").value
    editVisualDisplays("videoChanceText", "Create Video ", val, "%")
  })

  document.getElementById("createAudioChance").addEventListener('input', () => {
    const val = document.getElementById("createAudioChance").value
    editVisualDisplays("audioChanceText", "Create Audio ", val, "%")
  })

  document.getElementById("createPromptChance").addEventListener('input', () => {
    const val = document.getElementById("createPromptChance").value
    editVisualDisplays("promtpChanceText", "Create Prompt ", val, "%")
  })

  document.getElementById("createNotificationChance").addEventListener('input', () => {
    const val = document.getElementById("createNotificationChance").value
    editVisualDisplays("notificationChanceText", "Create Notification ", val, "%")
  })

  document.getElementById("imageAmountValue").addEventListener('input', () => {
    const val = document.getElementById("imageAmountValue").value
    editVisualDisplays("imageAountText", "Images ", val, "")
  })

  document.getElementById("videoAmountValue").addEventListener('input', () => {
    const val = document.getElementById("videoAmountValue").value
    editVisualDisplays("videoAmountText", "Videos ", val, "")
  })

  document.getElementById("audioAmountValue").addEventListener('input', () => {
    const val = document.getElementById("audioAmountValue").value
    editVisualDisplays("audioAmountText", "Audio ", val, "")
  })

  document.getElementById("promptAmountValue").addEventListener('input', () => {
    const val = document.getElementById("promptAmountValue").value
    editVisualDisplays("promptAmountText", "Prompts ", val, "")
  })

  document.getElementById("notificationAmountValue").addEventListener('input', () => {
    const val = document.getElementById("notificationAmountValue").value
    editVisualDisplays("notificationAmountText", "Notifications ", val, "")
  })

  document.getElementById("promptGain").addEventListener('input', () => {
    const val = document.getElementById("promptGain").value
    editVisualDisplays("gainAmountDis", "", val, "")
  })


  function editVisualDisplays(id, text1, value, text2) {
    document.getElementById(id).innerText = text1 + value + text2
  }







  let fadeTime = 5
  let prompts = []

  function loadSettings() {
    //popups
    if (localStorage.getItem('er_setting_imageChance')) {
      document.getElementById("createImageChance").value = localStorage.getItem('er_setting_imageChance')

      const val = parseInt(localStorage.getItem('er_setting_imageChance'))
      editVisualDisplays("imageChanceText", "Create Image ", val, "%")
    }

    if (localStorage.getItem('er_setting_videoChance')) {
      document.getElementById("createVideoChance").value = localStorage.getItem('er_setting_videoChance')

      const val = parseInt(localStorage.getItem('er_setting_videoChance'))
      editVisualDisplays("videoChanceText", "Create Video ", val, "%")
    }

    if (localStorage.getItem('er_setting_audioChance')) {
      document.getElementById("createAudioChance").value = localStorage.getItem('er_setting_audioChance')

      const val = parseInt(localStorage.getItem('er_setting_audioChance'))
      editVisualDisplays("audioChanceText", "Create Audio ", val, "%")
    }

    if (localStorage.getItem('er_setting_promptChance')) {
      document.getElementById("createPromptChance").value = localStorage.getItem('er_setting_promptChance')

      const val = parseInt(localStorage.getItem('er_setting_promptChance'))
      editVisualDisplays("promtpChanceText", "Create Prompt ", val, "%")
    }

    if (localStorage.getItem('er_setting_notificationChance')) {
      document.getElementById("createNotificationChance").value = localStorage.getItem('er_setting_notificationChance')

      const val = parseInt(localStorage.getItem('er_setting_notificationChance'))
      editVisualDisplays("notificationChanceText", "Create Notification ", val, "%")
    }

    if (localStorage.getItem('er_setting_imageAmount')) {
      document.getElementById("imageAmountValue").value = localStorage.getItem('er_setting_imageAmount')

      const val = parseInt(localStorage.getItem('er_setting_imageAmount'))
      editVisualDisplays("imageAountText", "Images ", val, "")
    }

    if (localStorage.getItem('er_setting_videoAmount')) {
      document.getElementById("videoAmountValue").value = localStorage.getItem('er_setting_videoAmount')

      const val = parseInt(localStorage.getItem('er_setting_videoAmount'))
      editVisualDisplays("videoAmountText", "Videos ", val, "")
    }

    if (localStorage.getItem('er_setting_audioAmount')) {
      document.getElementById("audioAmountValue").value = localStorage.getItem('er_setting_audioAmount')

      const val = parseInt(localStorage.getItem('er_setting_audioAmount'))
      editVisualDisplays("audioAmountText", "Audio ", val, "")
    }

    if (localStorage.getItem('er_setting_promptAmount')) {
      document.getElementById("promptAmountValue").value = localStorage.getItem('er_setting_promptAmount')

      const val = parseInt(localStorage.getItem('er_setting_promptAmount'))
      editVisualDisplays("promptAmountText", "Prompts ", val, "")
    }

    if (localStorage.getItem('er_setting_notificationAmount')) {
      document.getElementById("notificationAmountValue").value = localStorage.getItem('er_setting_notificationAmount')

      const val = parseInt(localStorage.getItem('er_setting_notificationAmount'))
      editVisualDisplays("notificationAmountText", "Notifications ", val, "")
    }

    if (localStorage.getItem('er_setting_fadeTime')) {
      fadeTime = parseInt(localStorage.getItem('er_setting_fadeTime'))

      document.getElementById('currentFadeTimeDisplay').innerHTML = `Current fade time: ${fadeTime}s`
      document.getElementById('setting_fadeTime').value = fadeTime
    }

    if (localStorage.getItem('er_setting_fade') == 'false') {
      document.getElementById('setting_fade').checked = false
    }

    if (localStorage.getItem('er_setting_videoEnd')) {
      switch(localStorage.getItem('er_setting_videoEnd')) {
        case "close":
          document.querySelector('input[name="vidEnd"][value="close"]').checked = true;
        break;
      }
    }

    if (localStorage.getItem('er_setting_audioEnd')) {
      switch(localStorage.getItem('er_setting_audioEnd')) {
        case "close":
          document.querySelector('input[name="audEnd"][value="close"]').checked = true;
        break;
      }
    }

    if (localStorage.getItem('er_setting_audioMedia')) {
      switch(localStorage.getItem('er_setting_audioMedia')) {
        case "vid":
          document.querySelector('input[name="audMedia"][value="vid"]').checked = true;
        break;
      }
    }

    if (localStorage.getItem('er_setting_limitAudioWindows') == 'false') {
      document.getElementById('limitAudio').checked = false
    }


    //interval
    if (localStorage.getItem('er_settings_randomDowntime') == 'true') {
      secondDownTimeToggle()
      document.getElementById('setting_randomDowntimeToggle').checked = true
      document.getElementById('setting_currentDowntimeDisplay').innerHTML = `Current downtime: ${localStorage.getItem('er_settings_downTime')}s - ${localStorage.getItem('er_settings_downTimeMax')}s`
    } else {
      document.getElementById('setting_currentDowntimeDisplay').innerHTML = `Current downtime: ${localStorage.getItem('er_settings_downTime')}s`
    }
 
    //placement
    if (localStorage.getItem('er_setting_popupType')) {
      console.log(localStorage.getItem('er_setting_popupType'))
      switch(localStorage.getItem('er_setting_popupType')) {
        case "random":
          document.querySelector('input[name="popupType"][value="random"]').checked = true;
        break;
        case "edges":
          document.querySelector('input[name="popupType"][value="edges"]').checked = true;
        break;
        case "corners":
          document.querySelector('input[name="popupType"][value="corners"]').checked = true;
        break;
      }
    }

    if (localStorage.getItem('er_setting_maxSize')) {
      document.getElementById("popupMaxSizePercent").value = parseInt(localStorage.getItem('er_setting_maxSize'))
      const val = parseInt(localStorage.getItem('er_setting_maxSize'))
      editVisualDisplays("popupMaxSizeText", "Max size: ", val, "")
    }
    if (localStorage.getItem('er_setting_minSize')) {
      document.getElementById("popupMinSizePercent").value = parseInt(localStorage.getItem('er_setting_minSize'))
      const val = parseInt(localStorage.getItem('er_setting_minSize'))
      editVisualDisplays("popupMinSizeText", "Min size: ", val, "")
    }

    if (localStorage.getItem('er_setting_bounce') === 'true') {
      document.getElementById('bounceCheck').checked = true
    }

    //overlays
    if (localStorage.getItem('er_setting_addoverlay')) {
      document.getElementById("addOverlayPercent").value = parseInt(localStorage.getItem('er_setting_addoverlay'))
      const val = parseInt(localStorage.getItem('er_setting_addoverlay'))
      editVisualDisplays("addOverlayText", "Add overlay ", val, "%")
    }

    if (localStorage.getItem('er_setting_addCaption')) {
      document.getElementById("addCaptionPercent").value = localStorage.getItem('er_setting_addCaption')

      const val = parseInt(localStorage.getItem('er_setting_addCaption'))
      editVisualDisplays("addCaptionText", "Add caption ", val, "%")
    }

    if (localStorage.getItem('er_setting_addColseButton')) {
      document.getElementById("addCloseButtonPercent").value = localStorage.getItem('er_setting_addColseButton')

      const val = parseInt(localStorage.getItem('er_setting_addColseButton'))
      editVisualDisplays("addCloseButtonText", "Add close button ", val, "%")
    }

    if (localStorage.getItem('er_setting_overlayOpacity')) {
      document.getElementById("overlayOpacityPercent").value = localStorage.getItem('er_setting_overlayOpacity')

      const val = parseInt(localStorage.getItem('er_setting_overlayOpacity'))
      editVisualDisplays("overlayOpacityText", "Overlay opacity ", val, "%")
    }

    if (localStorage.getItem('er_setting_captionOpacity')) {
      document.getElementById("captionOpacityPercent").value = localStorage.getItem('er_setting_captionOpacity')

      const val = parseInt(localStorage.getItem('er_setting_captionOpacity'))
      editVisualDisplays("captionOpcatityText", "Caption opacity ", val, "%")
    }

    if (localStorage.getItem('er_setting_closeButtonText')) {
      document.getElementById("chanegCloseButtonText").value = localStorage.getItem('er_setting_closeButtonText')
    }

    //captions
    if (localStorage.getItem('captionList')) {
      captionList = JSON.parse(localStorage.getItem('captionList'))
    }
    buildVisualCaptionList()

    //files
    if (localStorage.getItem("imageTitles")) {
      imageTitles = JSON.parse(localStorage.getItem("imageTitles"));
      images = JSON.parse(localStorage.getItem("images"));
    }

    if (localStorage.getItem("videoTitles")) {
      videoTitles = JSON.parse(localStorage.getItem("videoTitles"));
      videos = JSON.parse(localStorage.getItem("videos"));
    }

    if (localStorage.getItem("audioTitles")) {
      audioTitles = JSON.parse(localStorage.getItem("audioTitles"));
      audio = JSON.parse(localStorage.getItem("audio"));
    }

    //prompts

    if (localStorage.getItem('er_requiredCorrectPromptInputs')) {
      document.getElementById("correctPromptNum").value = localStorage.getItem('er_requiredCorrectPromptInputs')

      const val = parseInt(localStorage.getItem('er_requiredCorrectPromptInputs'))
      editVisualDisplays("numofinputs", "Number of correct inputs required: ", val, "")
    }

    if (localStorage.getItem('er_promptGainAmount')) {
      document.getElementById("promptGain").value = localStorage.getItem('er_promptGainAmount')

      const val = parseInt(localStorage.getItem('er_promptGainAmount'))
      editVisualDisplays("gainAmountDis", "", val, "")
    }

  if (localStorage.getItem('er_promptList')) {
    prompts = JSON.parse(localStorage.getItem('er_promptList'))
  } else {
    prompts = [
      'these',
      'are',
      'placeholders'
    ]
  }
    

    prompts.forEach((item) => {
      document.getElementById('promptDisplay').innerHTML += item + '<br>'
    })

    //client
    if (localStorage.getItem("er_muteMusic")) {
      document.getElementById("muteMusic").checked = true
      bgmMute = true
      setTimeout(() => {
        playingBgm.pause()
      }, 50)
    }

    if (localStorage.getItem('er_killStars')) {
      thermalPresure = false
      document.getElementById('killStars').checked = true
    }
  }

  loadSettings();


  function saveSettings() {
    //popups
    localStorage.setItem('er_setting_imageChance', document.getElementById("createImageChance").value)
    localStorage.setItem('er_setting_videoChance', document.getElementById("createVideoChance").value)
    localStorage.setItem('er_setting_audioChance', document.getElementById("createAudioChance").value)
    localStorage.setItem('er_setting_promptChance', document.getElementById("createPromptChance").value)
    localStorage.setItem('er_setting_notificationChance', document.getElementById("createNotificationChance").value)

    localStorage.setItem('er_setting_imageAmount', document.getElementById("imageAmountValue").value)
    localStorage.setItem('er_setting_videoAmount', document.getElementById("videoAmountValue").value)
    localStorage.setItem('er_setting_audioAmount', document.getElementById("audioAmountValue").value)
    localStorage.setItem('er_setting_promptAmount', document.getElementById("promptAmountValue").value)
    localStorage.setItem('er_setting_notificationAmount', document.getElementById("notificationAmountValue").value)

    localStorage.setItem('er_setting_fade', document.getElementById('setting_fade').checked)
    localStorage.setItem('er_setting_fadeTime', fadeTime)

    localStorage.setItem('er_setting_videoEnd', document.querySelector('input[name="vidEnd"]:checked').value)
    localStorage.setItem('er_setting_audioEnd', document.querySelector('input[name="audEnd"]:checked').value)

    localStorage.setItem('er_setting_audioMedia', document.querySelector('input[name="audMedia"]:checked').value)

    localStorage.setItem('er_setting_limitAudioWindows', document.getElementById('limitAudio').value)

    //interval
    localStorage.setItem('er_settings_randomDowntime', document.getElementById('setting_randomDowntimeToggle').checked)

    //placement
    localStorage.setItem('er_setting_popupType', document.querySelector('input[name="popupType"]:checked').value)

    localStorage.setItem('er_setting_maxSize', document.getElementById("popupMaxSizePercent").value)
    localStorage.setItem('er_setting_minSize', document.getElementById("popupMinSizePercent").value)

    localStorage.setItem('er_setting_bounce', document.getElementById("bounceCheck").checked )
    
    //overlays
    localStorage.setItem('er_setting_addoverlay', document.getElementById("addOverlayPercent").value)
    localStorage.setItem('er_setting_addCaption', document.getElementById("addCaptionPercent").value)
    localStorage.setItem('er_setting_addColseButton', document.getElementById("addCloseButtonPercent").value)

    localStorage.setItem('er_setting_overlayOpacity', document.getElementById("overlayOpacityPercent").value)
    localStorage.setItem('er_setting_captionOpacity', document.getElementById("captionOpacityPercent").value)

    if (document.getElementById("chanegCloseButtonText").value) {
      localStorage.setItem('er_setting_closeButtonText', document.getElementById("chanegCloseButtonText").value)
    } else {
      localStorage.setItem('er_setting_closeButtonText', "Close")
    }



    //captions
    localStorage.setItem('captionList', JSON.stringify(captionList))

    //prompts
    localStorage.setItem('er_requiredCorrectPromptInputs', document.getElementById('correctPromptNum').value)
    localStorage.setItem('er_promptGainAmount', document.getElementById('promptGain').value)

    localStorage.setItem('er_promptList', JSON.stringify(prompts))


    //client
    localStorage.setItem('er_muteMusic', document.getElementById("muteMusic").checked )
    localStorage.setItem('er_killStars', document.getElementById("killStars").checked )
  }

  document.getElementById('saveRandomDownTime').addEventListener('click', () => {
    localStorage.setItem('er_settings_downTime', document.getElementById('setting_randomDownTime').value)
    localStorage.setItem('er_settings_downTimeMax', document.getElementById('setting_randomDownTimeMax').value)

    if (document.getElementById('setting_randomDowntimeToggle').checked === false) {
      document.getElementById('setting_currentDowntimeDisplay').innerHTML = `Current downtime: ${document.getElementById('setting_randomDownTime').value}s`
    } else {
      document.getElementById('setting_currentDowntimeDisplay').innerHTML = `Current downtime: ${document.getElementById('setting_randomDownTime').value}s - ${document.getElementById('setting_randomDownTimeMax').value}s`
    }
  })

  
  document.getElementById('changeFadeTime').addEventListener('click', () => {
    fadeTime = document.getElementById('setting_fadeTime').value

    document.getElementById('currentFadeTimeDisplay').innerHTML = `Current fade time: ${fadeTime}s`
  })

  document.getElementById('changeCorrentInputs').addEventListener('click', () => {
    document.getElementById("numofinputs").innerHTML = `Number of correct inputs required: ${document.getElementById('correctPromptNum').value}`
  })

  document.getElementById('addPrompt').addEventListener('click', () => {
    prompts.push(document.getElementById('promptToadd').value)
    document.getElementById('promptDisplay').innerHTML = ''
    prompts.forEach((item) => {
      document.getElementById('promptDisplay').innerHTML += item + '<br>'
    })
  })

  document.getElementById('clearprompts').addEventListener('click', () => {
    prompts = []
    document.getElementById('promptDisplay').innerHTML = ''
  })
    

  function sendSettingsPackage() {
    ipcRenderer.invoke('setSettings', 
      localStorage.getItem('er_settings_randomDowntime'),
      parseInt(localStorage.getItem('er_settings_downTime')), 
      parseInt(localStorage.getItem('er_settings_downTimeMax')),

      localStorage.getItem('er_setting_imageChance'),
      localStorage.getItem('er_setting_videoChance'),
      localStorage.getItem('er_setting_audioChance'),
      localStorage.getItem('er_setting_promptChance'),
      localStorage.getItem('er_setting_notificationChance'),

      localStorage.getItem('er_setting_imageAmount'),
      localStorage.getItem('er_setting_videoAmount'),
      localStorage.getItem('er_setting_audioAmount'),
      localStorage.getItem('er_setting_promptAmount'),
      localStorage.getItem('er_setting_notificationAmount'),

      localStorage.getItem('er_setting_fade'),
      parseInt(localStorage.getItem('er_setting_fadeTime')),

      localStorage.getItem('er_setting_limitAudioWindows')
    )
  }

  const debugResult = document.getElementById('res')
  document.getElementById('dbg1').addEventListener('click', () => {
    debugResult.innerHTML = ''

    const arr = JSON.parse(localStorage.getItem('images'))
    console.log(arr.length)

    for (item of arr[0]) {
      console.log(item)
      debugResult.innerHTML += item + '<br>'
    }
    
  })

  document.getElementById('dbg2').addEventListener('click', () => {
    debugResult.innerHTML = ''

    const arr = JSON.parse(localStorage.getItem('videos'))
    console.log(arr.length)

    for (item of arr[0]) {
      console.log(item)
      debugResult.innerHTML += item + '<br>'
    }
    
  })

  document.getElementById('dbg3').addEventListener('click', () => {
    debugResult.innerHTML = ''

    const arr = JSON.parse(localStorage.getItem('audio'))
    console.log(arr.length)

    for (item of arr[0]) {
      console.log(item)
      debugResult.innerHTML += item + '<br>'
    }
    
  })

  document.getElementById('dbg4').addEventListener('click', () => {
    sendSettingsPackage()
    ipcRenderer.invoke('test')
  })







  //REMEMBER TO CHANGE THE CHILD ON LINE 27
  //menuButtonClick("home");
  //MUST BE LAST LINE
  document.querySelector(".menuButton").click();
})