// WELCOME TO THE CODEBASE OF TYPETALK

const talkForm = document.querySelector(".talk-form")
const textArea = document.querySelector("#talk-input")
const saveBtn = document.querySelector("#save-button")
const speakBtn = document.querySelector("#speak-button")
const voiceForm = document.querySelector(".voice-form");
const voiceInput = document.querySelector(".voice-form select");

const pitchSlider = document.getElementById("pitch");
const rateSlider = document.getElementById("rate");
const volumeSlider = document.getElementById("volume");

const pitchVal = document.getElementById("pitchVal");
const rateVal = document.getElementById("rateVal");
const volumeVal = document.getElementById("volumeVal");
const recentBox = document.querySelector(".recents")
const savedBox = document.querySelector(".saved-texts-list")
const quickPhraseBox = document.querySelector(".quick-phrases")

const recentSearchForm = document.querySelector(".recent-texts-search-form")
const recentSearchInput = document.querySelector("#recent-texts-search-input")
const savedSearchForm = document.querySelector(".saved-texts-search-form")
const savedSearchInput = document.querySelector("#saved-texts-search-input")

const recentTalkActions = document.querySelectorAll(".recent-talk-action")

const quickStartBtn = document.querySelector("#quick-start-button")
const setupGuideBtn = document.querySelector("#setup-guide-button")
const quickStartPopup = document.querySelector(".quick-start-popup")
const setupGuidePopup = document.querySelector(".setup-guide-popup")
const quickStartPopupBtn = document.querySelector("#quick-start-popup-button")
const quickStartPopupCross = document.querySelector(".quick-start-popup .popup-cross")
const setupGuidePopupCross = document.querySelector(".setup-guide-popup .popup-cross")
const testModePopup = document.querySelector(".test-mode-popup")

const testModePopupStartUsingButton = document.querySelector("#test-popup-startusing-button")
const testModePopupSetupGuideButton = document.querySelector("#test-popup-setupguide-button")

const changeVoiceSettingsButton = document.querySelector("#change-voice-settings")
const settingsMenu = document.querySelector(".settings-container")

const darkModeButton = document.querySelector("#dark-mode-button")

const backDrop = document.getElementById("backdrop")

const textVoiceButton = document.querySelector("#test-voice-button")

const synth = window.speechSynthesis;
let currentVoiceName = null;

const DARK_MODE_FILENAME = "darkmode.css"

let userData = getDataFromLocalStorage();

let recentTexts = userData["recent-texts"];
let savedTexts = userData["saved-texts"];
let quickPhrases = userData["quick-phrases"];

let isMenuVisible = false;
MENU_BREAKPOINT = 800;

if (window.innerWidth <= MENU_BREAKPOINT) {
  changeVoiceSettingsButton.style.visibility = "visible";
  changeVoiceSettingsButton.style.pointerEvents = "auto";
}
else {
  changeVoiceSettingsButton.style.visibility = "hidden";
  changeVoiceSettingsButton.style.pointerEvents = "none";
}

checkNoRecent();
checkNoSaved();
renderQuickPhrases();
renderRecentTalks();
renderSavedTexts();

let isDarkMode = userData["dark-mode"];
if (isDarkMode) renderDarkMode()
  
showPopup(testModePopup)

synth.onvoiceschanged = renderVoiceOptions;

updateSettings(userData["settings"]);
console.log(currentVoiceName);

[pitchSlider, rateSlider, volumeSlider].forEach(slider => {
  slider.addEventListener("input", () => {
    pitchVal.textContent = pitchSlider.value;
    rateVal.textContent = rateSlider.value;
    volumeVal.textContent = volumeSlider.value;
    saveDataInLocalStorage();
  });
});

window.addEventListener("resize", handleResize);
window.addEventListener("load", handleResize);

talkForm.addEventListener("submit", function(event) {
  event.preventDefault()
  handleSubmit()
})

textArea.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      console.log("submitting form")
      handleSubmit()
    }
  });

voiceForm.addEventListener("change", (e) => {
  if (e.target.name === "voice") {
    currentVoiceName = e.target.value;
    saveDataInLocalStorage();
  }
});

saveBtn.addEventListener("click", function(event) {
    event.preventDefault()
    let text = textArea.value.trim();
    if (!text) return;
    savedTexts.unshift(text)
    renderSavedTexts()
    talkForm.reset()
    saveDataInLocalStorage()
})

recentSearchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    searchRecentTexts();
    recentSearchForm.reset();
})

recentSearchInput.addEventListener("input", function() {
    searchRecentTexts()
})

savedSearchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    searchSavedTexts();
    savedSearchForm.reset()
})

savedSearchInput.addEventListener("input", function() {
    searchSavedTexts();
})

textVoiceButton.addEventListener("click", function(){
    speakText("Welcome To TypeTalk, This is Voice Check.");
});

quickStartBtn.addEventListener("click", function() {
  hideEveryPopup()
  toggleVisibility(quickStartPopup);
})

setupGuideBtn.addEventListener("click", function() {
  hideEveryPopup()
  toggleVisibility(setupGuidePopup);
})

quickStartPopupBtn.addEventListener("click", function() {
  hidePopup(quickStartPopup);
  textArea.focus();
})

quickStartPopupCross.addEventListener("click", function() {
  hidePopup(quickStartPopup)
})

setupGuidePopupCross.addEventListener("click", function() {
  hidePopup(setupGuidePopup);
});

darkModeButton.addEventListener("click", function() {toggleDarkMode()})

changeVoiceSettingsButton.addEventListener("click", function() {
  toggleMenu()
})

testModePopupStartUsingButton.addEventListener("click", function() {
  hidePopup(testModePopup);
  textArea.focus();
})

testModePopupSetupGuideButton.addEventListener("click", function() {
  hideEveryPopup();
  showPopup(setupGuidePopup);
})

function toggleMenu() {
  if (isMenuVisible) settingsMenu.style.left = "-250px";
  else settingsMenu.style.left = "0px";
  isMenuVisible = !isMenuVisible;
}

function hideEveryPopup() {
  let allPopups = document.querySelectorAll(".popup")
  allPopups.forEach(popup => hidePopup(popup))
}

function toggleVisibility(popup){
  if ( popup.classList.contains("hide") ) showPopup(popup);
  else hidePopup(popup)
}

function showPopup(popup) {
  popup.classList.add("show")
  popup.classList.remove("hide")
  backDrop.style.display = "block"
}

function hidePopup(popup) {
  popup.classList.add("hide")
  popup.classList.remove("show")
  backDrop.style.display = "none"
}

function showElement(element){
  element.style.display = "block";
}

function hideElement(element) {
  element.style.display = "none";
}

function toggleElementVisibility(element) {
    if (element.style.display = "none") showElement(element)
      else hideElement(element)
}

function toggleDarkMode() {
  if (isDarkMode) removeDarkMode();
  else renderDarkMode();
  isDarkMode = !isDarkMode;
  saveDataInLocalStorage()
}

function renderDarkMode() {
  const link = document.createElement("link");
  link.href = DARK_MODE_FILENAME;
  link.rel = "stylesheet";
  document.head.appendChild(link);
  darkModeButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

function removeDarkMode() {
  const link = document.querySelector(`link[href="${DARK_MODE_FILENAME}"]`);
  if (!link) return;

  link.parentNode.removeChild(link);
  darkModeButton.innerHTML = '<i class="fa-solid fa-moon"></i>'
}

function getDataFromLocalStorage() {
    let dataString = localStorage.getItem("user-data")
    console.log(dataString)
    if (!dataString) {
        console.log("return new object")
        return {
            "recent-texts" : [],
            "saved-texts" : [],
            "settings" : {
                "voice-name" : null,
                "pitch" : 1,
                "rate" : 1,
                "volume" : 1
            },
            "quick-phrases" : ["Hello! How are you?", "Excuse me!", "Need help!", "Thank you", "Yes", "No"],
            "dark-mode" : true
        }
    }
    let data = JSON.parse(dataString);
    console.log(data);
    return data;
}

function saveDataInLocalStorage() {
    let dataToSave = {
        "recent-texts" : recentTexts,
        "saved-texts" : savedTexts,
        "settings" : {
            "voice-name" : currentVoiceName,
            "pitch" : pitchSlider.value,
            "rate" : rateSlider.value,
            "volume" : volumeSlider.value
        },
        "quick-phrases" : quickPhrases,
        "dark-mode" : isDarkMode
    }
    localStorage.setItem("user-data", JSON.stringify(dataToSave));
}

function handleSubmit() {
    const text = textArea.value.trim()
    if (!text) return;
    speakText(text)
    talkForm.reset()
    recentTexts.push(text)
    renderRecentTalks()
    recentBox.scrollTop = recentBox.scrollHeight
    saveDataInLocalStorage()
}

function speakText(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = parseFloat(pitchSlider.value);
  utter.rate = parseFloat(rateSlider.value);
  utter.volume = parseFloat(volumeSlider.value);
  const selected = synth.getVoices().find(v => v.name === currentVoiceName);
  if (selected) utter.voice = selected;

  synth.cancel();
  setTimeout(() => {synth.speak(utter)}, 1);
}

function renderVoiceOptions() {
  const voices = synth.getVoices(); 

  const selectedVoiceName = currentVoiceName || voices[0]?.name;

  voiceForm.innerHTML += `
    <p class="settings-input-title">Change Voice</p>
    <select name="voice" id="voiceSelect" class="voice-select">
      ${voices.map((voice) => `
        <option value="${voice.name}" ${voice.name === selectedVoiceName ? 'selected' : ''}>
          ${voice.name} (${voice.lang})
        </option>
      `).join('')}
    </select>
  `;
}

function addHoverAndRepeatEventListeners() {
  const allRecentTalks = document.querySelectorAll(".recent-talk");
  if (!allRecentTalks) return;

  allRecentTalks.forEach(element => {

    let text = element.querySelector(".recent-talk-text").textContent;
    let speakIcon = element.querySelector(".retalk-icon");
    let saveIcon = element.querySelector(".save-icon");
    let deleteIcon = element.querySelector(".delete-icon")

    if (window.innerWidth <= MENU_BREAKPOINT) {
      element.addEventListener("click", function(event) {
        event.stopPropagation()
        console.log(element, "clicked")
        element.querySelectorAll("i").forEach(icon => {
          showElement(icon)
        });
      })
    }
    element.querySelectorAll("i").forEach(icon => icon.style.display = "none");
    element.addEventListener("mouseenter", function(event) {
      showElement(speakIcon)
      if (!savedTexts.includes(text)) showElement(saveIcon)
      showElement(deleteIcon)
    });
    element.addEventListener("mouseleave", function(event) {
      element.querySelectorAll("i").forEach(icon => icon.style.display = "none");
    });

  

    speakIcon.addEventListener("click", function() {
      speakText(text);
    })

    saveIcon.addEventListener("click", function() {
        savedTexts.unshift(text)
        renderSavedTexts();
        saveDataInLocalStorage();
    })

    deleteIcon.addEventListener("click", function() {
        recentTexts = recentTexts.filter(recentText => recentText != text);
        renderRecentTalks();
        saveDataInLocalStorage();
    })
  });
}

function renderRecentTalks(talks = recentTexts) {
  if (talks.length <= 0) {
    checkNoRecent();
    return;
  }
  recentBox.innerHTML = ""
  talks.forEach((talk, index) => {
    recentBox.innerHTML += `
      <div data-id="${index}" class="recent-talk">
          <span class="recent-talk-text">${talk}</span>
          <i title="Speak the text" class="fa-solid fa-circle-play retalk-icon recent-talk-action"></i>
          <i title="Save text" data-id="${index}" class="fa-solid fa-download save-icon recent-talk-action"></i>
          <i class="fa-solid fa-trash delete-icon recent-talk-action"></i>
      </div>
    `
  });
  addHoverAndRepeatEventListeners()
}

function checkNoRecent() {
    if (recentTexts.length > 0) return;
    recentBox.innerHTML = ""
    const message = document.createElement("p")
    message.textContent = "Your Recent Messages Will Appear Here"
    message.style.color = "gray"
    message.style.fontWeight = "300"
    message.style.fontSize = "14px";
    message.classList = "no-recents-text"
    message.style.textAlign = "center"
    recentBox.appendChild(message)
}

function checkNoSaved() {
    if (savedTexts.length > 0) return;
    savedBox.innerHTML = ""
    const message = document.createElement("p")
    message.textContent = "Your Saved Messages Will Appear Here"
    message.style.color = "gray"
    message.style.fontWeight = "300"
    message.style.fontSize = "14px";
    message.classList = "no-recents-text"
    message.style.textAlign = "center"
    savedBox.appendChild(message)
}

function renderSavedTexts(texts=savedTexts) {
    if (texts.length <= 0) {
        checkNoSaved();
        return;
    }
    savedBox.innerHTML = ""
    texts.forEach((text, index) => {
        savedBox.innerHTML += `
            <div data-id="${index}"  class="saved-text-wrapper">
                <div class="play-wrapper">
                    <i title="Speak the text" class="fa-solid fa-circle-play retalk-icon"></i>
                </div>
                <div class="saved-main-wrapper">
                    <p class="saved-text">${text}</p>
                </div>
                <div class="menu">     
                    <i data-id="${index}" class="fa-solid fa-pen edit-icon"></i>
                    <i data-id="${index}" class="fa-solid fa-trash delete-icon"></i>
                </div>
            </div>
        `
    });
    addEventListenersToSavedTexts()
}

function addEventListenersToSavedTexts() {
    const allSavedTexts = document.querySelectorAll(".saved-text-wrapper")
    if (!allSavedTexts) return;

    allSavedTexts.forEach(element => {
        let text = element.querySelector(".saved-text").textContent
        let playBtn = element.querySelector(".play-wrapper .retalk-icon")
        let editBtn = element.querySelector(".edit-icon")
        let deleteBtn = element.querySelector(".delete-icon")

        playBtn.addEventListener("click", function() {
            speakText(text);
        })

        editBtn.addEventListener("click", function() {
            textArea.value = text;
            textArea.focus();
        })

        deleteBtn.addEventListener("click", function() {
            savedTexts = savedTexts.filter(savedText => savedText != text);
            renderSavedTexts();
            saveDataInLocalStorage()
        })
    })
}

function renderQuickPhrases() {
    quickPhraseBox.innerHTML = ""
    quickPhrases.forEach(phrase => {
        let phraseElement = document.createElement("p")
        phraseElement.classList.add("quick-phrase-text")
        phraseElement.textContent = phrase
        phraseElement.addEventListener("click", function(event) {
            event.stopPropagation()
            speakText(phrase)
        })
        quickPhraseBox.appendChild(phraseElement)
    })
}

function updateSettings(data) {
    pitchSlider.value = data["pitch"]
    pitchVal.textContent = data["pitch"]
    rateSlider.value = data["rate"]
    rateVal.textContent = data["rate"]
    volumeSlider.value = data["volume"]
    volumeVal.textContent = data["volume"]
    currentVoiceName = data["voice-name"]
    // voiceInput.value = currentVoiceName;
}

function searchRecentTexts() {
    if (recentTexts.length <= 0) return;
    let key = recentSearchInput.value.trim();
    if (!key) renderRecentTalks();
    let result = recentTexts.filter(text => text.includes(key));
    if (result.length == 0) showNoSerchResult(recentBox);
    else renderRecentTalks(result);
}

function showNoSerchResult(box) {
    const element = document.createElement("p");
    element.classList.add("no-recents-text");
    // element.innerHTML+= "<i class=\"fa-solid fa-exclamation\"></i>"
    element.textContent = "No Match Found";
    element.style.color = "gray";
    element.style.fontSize = "15px;";
    box.innerHTML = "";
    box.appendChild(element);
}

function searchSavedTexts() {
    if (savedTexts.length <= 0) return;
    let key = savedSearchInput.value.trim();
    if (!key) renderSavedTexts();
    let result = savedTexts.filter(text => text.includes(key));
    if (result.length == 0) showNoSerchResult(savedBox);
    else renderSavedTexts(result);
}

function handleResize() {
  const blocker = document.getElementById("screenBlocker");
  const container = document.querySelector(".container");

  if (window.innerWidth < 550) {
    blocker.style.display = "flex";
    container.style.display = "none";
  } else {
    blocker.style.display = "none";
    container.style.display = "block";
  }
}

