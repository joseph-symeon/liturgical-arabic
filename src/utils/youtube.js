// Singleton YouTube IFrame API loader.
// Multiple YouTubeClipPlayer instances share one API load.

const pendingCallbacks = [];
let apiReady = false;

if (typeof window !== 'undefined' && !window.__ytApiLoading) {
  window.__ytApiLoading = true;

  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    if (typeof prev === 'function') prev();
    pendingCallbacks.splice(0).forEach(cb => cb());
  };

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

export function onYouTubeReady(callback) {
  if (apiReady) {
    callback();
  } else {
    pendingCallbacks.push(callback);
  }
}
