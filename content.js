browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getVideoInfo') {
      const video = document.querySelector('video');
      const currentTime = video ? video.currentTime : 0;
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get('v');
      const title = document.title.replace(' - YouTube', '');
      sendResponse({ title, currentTime, videoId });
    }
    return true; // Indicates asynchronous response
  });
  