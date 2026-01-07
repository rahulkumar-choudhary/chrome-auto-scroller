let fullScrollTime = 30; // seconds

chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  if (command === "toggle-scroll") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toggleScroll,
      args: [fullScrollTime]
    });
  }

  if (command === "speed-up") {
    fullScrollTime = Math.max(5, fullScrollTime - 5); // faster
  }

  if (command === "speed-down") {
    fullScrollTime += 5; // slower
  }
});

function toggleScroll(fullScrollTime) {
  if (window.autoScrollInterval) {
    clearInterval(window.autoScrollInterval);
    window.autoScrollInterval = null;
  } else {
    const totalHeight =
      document.body.scrollHeight - window.innerHeight;

    const stepTime = 20;
    const steps = (fullScrollTime * 1000) / stepTime;
    const stepPx = totalHeight / steps;

    window.autoScrollInterval = setInterval(() => {
      window.scrollBy(0, stepPx);
    }, stepTime);
  }
}
