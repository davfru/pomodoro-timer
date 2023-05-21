const timeOption = document.getElementById("time-option");
timeOption.addEventListener("change", (event) => {
    const val = event.target.value;
    console.log(val);
    if (val < 1 || val > 60) {
        timeOption.value = 25;
    }
});

const saveBtn = document.getElementById("save-btn");
saveBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
        timeOption: timeOption.value,
    });
});

chrome.storage.local.get(["timeOption"], (res) => {
    timeOption.value = res.timeOption;
});
