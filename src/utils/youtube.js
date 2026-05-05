// Singleton YouTube IFrame API loader.
// Multiple YouTubeClipPlayer instances share one API load.

const pendingCallbacks = typeof window !== 'undefined'
  ? window.__ytPendingCallbacks || []
  : [];
if (typeof window !== 'undefined') {
  window.__ytPendingCallbacks = pendingCallbacks;
}

function flushCallbacks() {
  if (typeof window === 'undefined') return;
  window.__ytApiReady = true;
  pendingCallbacks.splice(0).forEach(cb => cb());
}

if (typeof window !== 'undefined' && window.YT?.Player) {
  window.__ytApiReady = true;
}

if (typeof window !== 'undefined' && !window.__ytApiLoading && !window.__ytApiReady) {
  window.__ytApiLoading = true;

  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    if (typeof prev === 'function') prev();
    flushCallbacks();
  };

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

export function onYouTubeReady(callback) {
  if (typeof window === 'undefined') return;
  if (window.YT?.Player || window.__ytApiReady) {
    window.__ytApiReady = true;
    callback();
  } else {
    pendingCallbacks.push(callback);
  }
}
