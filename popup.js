const durationInput = document.getElementById("duration");
const durationLabel = document.getElementById("durationLabel");
const timeInput = document.getElementById("time");
const info = document.getElementById("info");
const infoBox = document.getElementById("infoBox");

durationLabel.textContent = `${durationInput.value} sec`;

durationInput.addEventListener("input", () => {
  durationLabel.textContent = `${durationInput.value} sec`;
});

info.addEventListener("click", () => {
  infoBox.style.display =
    infoBox.style.display === "block" ? "none" : "block";
});

document.getElementById("start").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const fullScrollTime = parseInt(durationInput.value);
  const stopTime = parseInt(timeInput.value) || null;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: startScrollByTime,
    args: [fullScrollTime, stopTime]
  });
});

document.getElementById("stop").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: stopScroll
  });
});

function startScrollByTime(fullScrollTime, stopTime) {
  if (window.autoScrollInterval) return;

  const startTime = Date.now();
  const totalHeight =
    document.body.scrollHeight - window.innerHeight;

  const stepTime = 20;
  const steps = (fullScrollTime * 1000) / stepTime;
  const stepPx = totalHeight / steps;

  window.autoScrollInterval = setInterval(() => {
    const atBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight;

    const timedOut =
      stopTime && (Date.now() - startTime >= stopTime * 1000);

    if (atBottom || timedOut) {
      clearInterval(window.autoScrollInterval);
      window.autoScrollInterval = null;
      return;
    }

    window.scrollBy(0, stepPx);
  }, stepTime);
}

function stopScroll() {
  clearInterval(window.autoScrollInterval);
  window.autoScrollInterval = null;
}
