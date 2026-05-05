import React, { useEffect, useRef, useState } from 'react';
import { onYouTubeReady } from '../../utils/youtube.js';

let playerCount = 0;

export default function YouTubeClipPlayer({ videoId, startSeconds, endSeconds, defaultPlaybackRate = 1.0 }) {
  const playerIdRef = useRef(null);
  if (playerIdRef.current === null) {
    playerIdRef.current = `yt-clip-${++playerCount}`;
  }
  const playerId = playerIdRef.current;

  const playerRef = useRef(null);
  const playerHostRef = useRef(null);
  const intervalRef = useRef(null);
  const isSeekingRef = useRef(false);
  const playbackRateRef = useRef(defaultPlaybackRate);
  const userStartedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(defaultPlaybackRate);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [playerError, setPlayerError] = useState(null);

  const clipDuration = endSeconds - startSeconds;

  function formatTime(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function startLoop(player) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!player || isSeekingRef.current) return;
      const absoluteTime = player.getCurrentTime();
      if (absoluteTime >= endSeconds) {
        player.seekTo(startSeconds, true);
        setProgress(0);
        return;
      }
      const relativeTime = absoluteTime - startSeconds;
      if (relativeTime >= 0 && relativeTime <= clipDuration) {
        setProgress(relativeTime);
      }
    }, 100);
  }

  useEffect(() => {
    let destroyed = false;
    setIsReady(false);
    setPlayerError(null);

    if (!videoId) {
      setPlayerError('Missing YouTube video ID.');
      return () => {
        destroyed = true;
      };
    }

    onYouTubeReady(() => {
      if (destroyed || !playerHostRef.current) return;

      playerHostRef.current.innerHTML = '';
      const playerElement = document.createElement('div');
      playerElement.id = playerId;
      playerHostRef.current.appendChild(playerElement);

      try {
        new window.YT.Player(playerId, {
          width: '200',
          height: '200',
          videoId,
          playerVars: {
            controls: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            playsinline: 1
          },
          events: {
            onReady(event) {
              if (destroyed) return;
              playerRef.current = event.target;
              event.target.seekTo(startSeconds, true);
              event.target.setPlaybackRate(playbackRateRef.current);
              setIsReady(true);
            },
            onStateChange(event) {
              const { PlayerState } = window.YT;
              const state = event.data;
              if (state === PlayerState.PLAYING || state === PlayerState.BUFFERING) {
                if (!userStartedRef.current) {
                  event.target.pauseVideo();
                  event.target.seekTo(startSeconds, true);
                  setProgress(0);
                  setIsPlaying(false);
                  return;
                }
                setIsPlaying(true);
                if (state === PlayerState.PLAYING) {
                  startLoop(event.target);
                }
              }
              if (state === PlayerState.PAUSED || state === PlayerState.ENDED) {
                setIsPlaying(false);
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              }
            }
          }
        });
      } catch (error) {
        setPlayerError(error instanceof Error ? error.message : 'Unable to initialize YouTube player.');
      }
    });

    return () => {
      destroyed = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }
      if (playerHostRef.current) {
        playerHostRef.current.innerHTML = '';
      }
      setIsReady(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, startSeconds, endSeconds]);

  // Close speed menu when clicking outside the speed wrapper
  useEffect(() => {
    if (!speedMenuOpen) return;
    const close = () => setSpeedMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [speedMenuOpen]);

  function handlePlayPause() {
    const player = playerRef.current;
    if (!player || !isReady) return;
    const state = player.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      userStartedRef.current = true;
      player.seekTo(startSeconds + progress, true);
      player.playVideo();
    }
  }

  function handleProgressChange(e) {
    isSeekingRef.current = true;
    setProgress(Number(e.target.value));
  }

  function handleSeekCommit(e) {
    const player = playerRef.current;
    if (player) {
      player.seekTo(startSeconds + Number(e.target.value), true);
    }
    isSeekingRef.current = false;
  }

  function adjustSpeed(delta) {
    const next = Math.max(0.25, Math.min(2, Math.round((playbackRateRef.current + delta) * 100) / 100));
    playbackRateRef.current = next;
    setPlaybackRate(next);
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(next);
    }
  }

  const speedDisplay = `${Number(playbackRate.toFixed(2))}×`;
  const ytUrl = `https://www.youtube.com/watch?v=${videoId}&t=${startSeconds}s`;

  return (
    <>
      <div className="yt-hidden" aria-hidden="true">
        <div ref={playerHostRef} />
      </div>

      <div className="lp-clip-player">
        {playerError && <p className="lp-player-error">{playerError}</p>}
        <div className="lp-controls">
          <button
            className="lp-icon-button"
            onClick={handlePlayPause}
            disabled={!isReady}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            )}
          </button>

          <input
            className="lp-progress"
            type="range"
            min="0"
            max={clipDuration}
            step="0.05"
            value={progress}
            onChange={handleProgressChange}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
          />

          <div className="lp-time">
            {formatTime(progress)} / {formatTime(clipDuration)}
          </div>

          <div className="lp-speed-wrapper" onClick={e => e.stopPropagation()}>
            <button
              className="lp-speed-button"
              onClick={() => setSpeedMenuOpen(o => !o)}
            >
              {speedDisplay}
            </button>

            {speedMenuOpen && (
              <div className="lp-speed-menu">
                <div className="lp-speed-title">Speed</div>
                <div className="lp-speed-row">
                  <button className="lp-speed-adjust" onClick={() => adjustSpeed(-0.05)}>−</button>
                  <div className="lp-speed-value">{speedDisplay}</div>
                  <button className="lp-speed-adjust" onClick={() => adjustSpeed(0.05)}>+</button>
                </div>
              </div>
            )}
          </div>

          <a
            className="lp-youtube-link"
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch on YouTube"
          >
            <svg viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="4" fill="#ff0000" />
              <polygon points="10,8 16,12 10,16" fill="#fff" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
