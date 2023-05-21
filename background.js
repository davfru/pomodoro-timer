chrome.alarms.create("pomodoroTimer", {
    periodInMinutes: 1 / 60,
});

const playAudio = () => {
    // crea un nuovo AudioContext
    const audioCtx = new (self.AudioContext || self.webkitAudioContext)();

    // carica il file audio
    const audioUrl = chrome.runtime.getURL('./Free_Test_Data_100KB_MP3');
    const request = new XMLHttpRequest();
    request.open('GET', audioUrl, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
    // decodifica il file audio
    audioCtx.decodeAudioData(request.response, function (buffer) {
        // crea un nuovo buffer source
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        // collega il buffer source all'output del contesto audio
        source.connect(audioCtx.destination);
        // riproduci il suono
        source.start();
    });
    };
    request.send();
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pomodoroTimer") {
        chrome.storage.local.get(
            ["timer", "isRunning", "timeOption"],
            (res) => {
                if (res.isRunning) {
                    let timer = res.timer + 1;
                    let isRunning = true;
                    if (timer === 60 * res.timeOption) {
                        this.registration.showNotification("Pomodoro Timer", {
                            body: `${res.timeOption} minutes has passed`,
                            icon: "icon.png",
                        });
                        console.log("notification sent");
                        timer = 0;
                        isRunning = false;
                        playAudio();
                    }
                    chrome.storage.local.set({
                        timer,
                        isRunning,
                    });
                }
            }
        );
    }
});

chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
    chrome.storage.local.set({
        timer: "timer" in res ? res.timer : 0,
        timeOption: "timeOption" in res ? res.timeOption : 25,
        isRunning: "isRunning" in res ? res.isRunning : false,
    });
});
