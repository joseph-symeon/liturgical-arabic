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
  const playbackRateRef = useRef(defaultPlaybackRate);
  const userStartedRef = useRef(false);
  const loopEnabledRef = useRef(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(defaultPlaybackRate);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [playerError, setPlayerError] = useState(null);

  function startLoop(player) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!player) return;
      const absoluteTime = player.getCurrentTime();
      if (absoluteTime >= endSeconds) {
        if (!loopEnabledRef.current) {
          player.pauseVideo();
          player.seekTo(startSeconds, true);
          return;
        }
        player.seekTo(startSeconds, true);
        return;
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
      const currentTime = player.getCurrentTime();
      userStartedRef.current = true;
      if (currentTime < startSeconds || currentTime >= endSeconds) {
        player.seekTo(startSeconds, true);
      }
      player.playVideo();
    }
  }

  function adjustSpeed(delta) {
    const next = Math.max(0.5, Math.min(2, Math.round((playbackRateRef.current + delta) * 10) / 10));
    playbackRateRef.current = next;
    setPlaybackRate(next);
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(next);
    }
  }

  function toggleLoop() {
    setLoopEnabled(value => {
      const next = !value;
      loopEnabledRef.current = next;
      return next;
    });
  }

  const speedDisplay = `${playbackRate.toFixed(1)}×`;
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
            className={`lp-icon-button${isPlaying ? " active" : ""}`}
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

          <button
            type="button"
            className={`lp-loop-button${loopEnabled ? " active" : ""}`}
            onClick={toggleLoop}
            aria-label={loopEnabled ? "Disable loop" : "Enable loop"}
            aria-pressed={loopEnabled}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17 2l4 4-4 4" />
              <path d="M3 11V9a3 3 0 0 1 3-3h15" />
              <path d="M7 22l-4-4 4-4" />
              <path d="M21 13v2a3 3 0 0 1-3 3H3" />
            </svg>
          </button>

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
                  <button className="lp-speed-adjust" onClick={() => adjustSpeed(-0.1)}>−</button>
                  <div className="lp-speed-value">{speedDisplay}</div>
                  <button className="lp-speed-adjust" onClick={() => adjustSpeed(0.1)}>+</button>
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
