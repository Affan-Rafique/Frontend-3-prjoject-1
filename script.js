const setBtn = document.getElementById("setBtn");
const timersList = document.getElementById("timersList");
const alarmSound = document.getElementById("alarmSound");

// Allow only numbers in input
["hours", "minutes", "seconds"].forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, ""); // Remove non-digits
  });
});

let timers = [];

setBtn.addEventListener("click", () => {
  const h = parseInt(document.getElementById("hours").value) || 0;
  const m = parseInt(document.getElementById("minutes").value) || 0;
  const s = parseInt(document.getElementById("seconds").value) || 0;

  if (h === 0 && m === 0 && s === 0) {
    alert("Please enter a valid time!");
    return;
  }

  const totalSeconds = h * 3600 + m * 60 + s;
  createTimer(totalSeconds);

  document.getElementById("hours").value = "";
  document.getElementById("minutes").value = "";
  document.getElementById("seconds").value = "";
});

function createTimer(totalSeconds) {
  const timerObj = {
    id: Date.now(),
    timeLeft: totalSeconds,
    interval: null
  };

  const timerDiv = document.createElement("div");
  timerDiv.classList.add("timer");
  timerDiv.setAttribute("data-id", timerObj.id);
  timerDiv.innerHTML = `
    <p>Time Left: ${formatTime(totalSeconds)}</p>
    <button>Delete</button>
  `;

  timersList.appendChild(timerDiv);
  timers.push(timerObj);

  // Remove "no timers" text
  const noTimersMsg = document.querySelector(".no-timers");
  if (noTimersMsg) noTimersMsg.remove();

  const deleteBtn = timerDiv.querySelector("button");

  deleteBtn.addEventListener("click", () => {
    clearInterval(timerObj.interval);
    timerDiv.remove();
    timers = timers.filter(t => t.id !== timerObj.id);
    if (timers.length === 0) showNoTimersMessage();
  });

  // Start countdown
  timerObj.interval = setInterval(() => {
    timerObj.timeLeft--;
    if (timerObj.timeLeft >= 0) {
      timerDiv.querySelector("p").textContent = `Time Left: ${formatTime(timerObj.timeLeft)}`;
    } else {
      clearInterval(timerObj.interval);
      showTimerUp(timerDiv, timerObj);
    }
  }, 1000);
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h)} : ${pad(m)} : ${pad(s)}`;
}

function pad(num) {
  return num.toString().padStart(2, "0");
}

function showTimerUp(timerDiv, timerObj) {
  timerDiv.classList.add("up");
  timerDiv.innerHTML = `
    <p>Timer Is Up!</p>
    <button id="stopBtn">Stop</button>
  `;

  alarmSound.play();

  const stopBtn = timerDiv.querySelector("#stopBtn");
  stopBtn.addEventListener("click", () => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    timerDiv.remove();
    timers = timers.filter(t => t.id !== timerObj.id);
    if (timers.length === 0) showNoTimersMessage();
  });
}

function showNoTimersMessage() {
  const msg = document.createElement("p");
  msg.classList.add("no-timers");
  msg.textContent = "You have no timers currently!";
  timersList.appendChild(msg);
}
