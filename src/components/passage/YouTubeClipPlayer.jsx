import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { onYouTubeReady } from '../../utils/youtube.js';

let playerCount = 0;
const PLAYBACK_RATE_STORAGE_KEY = 'liturgical-arabic:chant-playback-rate';
const LOOP_RESTART_LEAD_SECONDS = 0.05;

function normalizePlaybackRate(value, fallback = 1.0) {
  const numericValue = Number.parseFloat(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.max(0.5, Math.min(2, Math.round(numericValue * 10) / 10));
}

function getStoredPlaybackRate(fallback = 1.0) {
  if (typeof window === 'undefined') return normalizePlaybackRate(fallback);
  const stored = window.localStorage.getItem(PLAYBACK_RATE_STORAGE_KEY);
  return normalizePlaybackRate(stored, normalizePlaybackRate(fallback));
}

const YouTubeClipPlayer = forwardRef(function YouTubeClipPlayer({ videoId, recordingId, startSeconds, endSeconds, defaultPlaybackRate = 1.0, onTimeUpdate }, ref) {
  const initialPlaybackRate = getStoredPlaybackRate(defaultPlaybackRate);
  const playerIdRef = useRef(null);
  if (playerIdRef.current === null) {
    playerIdRef.current = `yt-clip-${++playerCount}`;
  }
  const playerId = playerIdRef.current;

  const playerRef = useRef(null);
  const playerHostRef = useRef(null);
  const intervalRef = useRef(null);
  const playbackRateRef = useRef(initialPlaybackRate);
  const userStartedRef = useRef(false);
  const loopEnabledRef = useRef(true);
  const playClockRef = useRef({ mediaTime: startSeconds, wallTime: 0, playbackRate: initialPlaybackRate });
  const playRequestedRef = useRef(false);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(initialPlaybackRate);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [playerError, setPlayerError] = useState(null);
  const [currentSeconds, setCurrentSeconds] = useState(startSeconds);

  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PLAYBACK_RATE_STORAGE_KEY, String(playbackRate));
  }, [playbackRate]);

  function emitTimeUpdate(time) {
    setCurrentSeconds(time);
    onTimeUpdateRef.current?.(time);
  }

  function clearLoopTimers() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function cueClip(player, startAt = startSeconds) {
    player.cueVideoById({ videoId, startSeconds: startAt, endSeconds });
    player.setPlaybackRate(playbackRateRef.current);
  }

  function loadClip(player, startAt = startSeconds) {
    player.loadVideoById({ videoId, startSeconds: startAt, endSeconds });
    player.setPlaybackRate(playbackRateRef.current);
  }

  function stopAtClipEnd(player) {
    if (!player) return;
    clearLoopTimers();
    playRequestedRef.current = false;
    player.pauseVideo();
    cueClip(player, startSeconds);
    playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
    emitTimeUpdate(startSeconds);
  }

  function restartLoop(player) {
    if (!player) return;
    player.seekTo(startSeconds, true);
    playRequestedRef.current = true;
    userStartedRef.current = true;
    playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
    emitTimeUpdate(startSeconds);
    player.playVideo();
  }

  function startLoop(player, fromSeconds = null) {
    clearLoopTimers();
    const rawCurrentTime = fromSeconds ?? player.getCurrentTime();
    const currentTime = rawCurrentTime < startSeconds || rawCurrentTime >= endSeconds ? startSeconds : rawCurrentTime;
    if (fromSeconds === null && currentTime !== rawCurrentTime) {
      player.seekTo(startSeconds, true);
    }
    if (!playRequestedRef.current) {
      playClockRef.current = { mediaTime: currentTime, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
    }
    intervalRef.current = setInterval(() => {
      if (!player) return;
      const currentTime = player.getCurrentTime();
      playClockRef.current = {
        mediaTime: currentTime,
        wallTime: performance.now(),
        playbackRate: playbackRateRef.current || 1
      };
      emitTimeUpdate(currentTime);
      const boundarySeconds = loopEnabledRef.current
        ? Math.max(startSeconds, endSeconds - LOOP_RESTART_LEAD_SECONDS)
        : endSeconds;
      if (currentTime >= boundarySeconds) {
        if (loopEnabledRef.current) {
          restartLoop(player);
        } else {
          stopAtClipEnd(player);
        }
        return;
      }
    }, 40);
  }

  useEffect(() => {
    let destroyed = false;
    userStartedRef.current = false;
    playRequestedRef.current = false;
    playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
    setIsReady(false);
    setIsPlaying(false);
    setPlayerError(null);
    setCurrentSeconds(startSeconds);
    clearLoopTimers();

    if (!videoId) {
      setPlayerError(recordingId ? `Recording "${recordingId}" is missing a YouTube video ID.` : 'Missing YouTube video ID.');
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
            autoplay: 0,
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
              cueClip(event.target, startSeconds);
              playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
              setIsReady(true);
            },
            onStateChange(event) {
              const { PlayerState } = window.YT;
              const state = event.data;
              if (state === PlayerState.ENDED) {
                if (userStartedRef.current && playRequestedRef.current && loopEnabledRef.current) {
                  restartLoop(event.target);
                  return;
                }
                setIsPlaying(false);
                clearLoopTimers();
                return;
              }
              if (state === PlayerState.PLAYING || state === PlayerState.BUFFERING) {
                if (!userStartedRef.current) {
                  event.target.pauseVideo();
                  cueClip(event.target, startSeconds);
                  playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
                  setIsPlaying(false);
                  return;
                }
                setIsPlaying(true);
                if (state === PlayerState.PLAYING) {
                  startLoop(event.target);
                }
              }
              if (state === PlayerState.PAUSED) {
                setIsPlaying(false);
                clearLoopTimers();
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
      userStartedRef.current = false;
      playRequestedRef.current = false;
      clearLoopTimers();
      if (playerRef.current) {
        try { playerRef.current.pauseVideo(); } catch (_) {}
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
      playRequestedRef.current = false;
      player.pauseVideo();
    } else {
      const currentTime = player.getCurrentTime();
      userStartedRef.current = true;
      playRequestedRef.current = true;
      if (currentTime < startSeconds || currentTime >= endSeconds) {
        loadClip(player, startSeconds);
        playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
        emitTimeUpdate(startSeconds);
      } else {
        playClockRef.current = { mediaTime: currentTime, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
        emitTimeUpdate(currentTime);
        player.playVideo();
        startLoop(player, currentTime);
      }
    }
  }

  useImperativeHandle(ref, () => ({
    togglePlayPause: handlePlayPause
  }));

  function handleStartOver() {
    const player = playerRef.current;
    if (!player || !isReady) return;
    const state = player.getPlayerState();
    const shouldResume = state === window.YT.PlayerState.PLAYING || state === window.YT.PlayerState.BUFFERING;
    userStartedRef.current = shouldResume || userStartedRef.current;
    playRequestedRef.current = shouldResume;
    if (shouldResume) {
      loadClip(player, startSeconds);
    } else {
      cueClip(player, startSeconds);
    }
    playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
    emitTimeUpdate(startSeconds);
  }

  function handleProgressChange(event) {
    const player = playerRef.current;
    if (!player || !isReady) return;
    const nextTime = Number(event.target.value);
    const state = player.getPlayerState();
    const shouldResume = state === window.YT.PlayerState.PLAYING || state === window.YT.PlayerState.BUFFERING;
    playRequestedRef.current = shouldResume;
    player.seekTo(nextTime, true);
    playClockRef.current = { mediaTime: nextTime, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
    emitTimeUpdate(nextTime);
    if (shouldResume) {
      startLoop(player);
    }
  }

  function adjustSpeed(delta) {
    const next = normalizePlaybackRate(playbackRateRef.current + delta, playbackRateRef.current);
    playbackRateRef.current = next;
    playClockRef.current = {
      mediaTime: playerRef.current?.getCurrentTime?.() ?? playClockRef.current.mediaTime,
      wallTime: performance.now(),
      playbackRate: next
    };
    setPlaybackRate(next);
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(next);
    }
  }

  function toggleLoop() {
    setLoopEnabled(value => {
      const next = !value;
      loopEnabledRef.current = next;
      const player = playerRef.current;
      if (player && playRequestedRef.current) {
        startLoop(player);
      }
      return next;
    });
  }

  const speedDisplay = `${playbackRate.toFixed(1)}×`;
  const showExtendedControls = endSeconds - startSeconds > 30;
  const progressValue = Math.max(startSeconds, Math.min(endSeconds, currentSeconds));
  const progressPercent = ((progressValue - startSeconds) / Math.max(0.001, endSeconds - startSeconds)) * 100;

  return (
    <>
      <div className="yt-hidden" aria-hidden="true">
        <div ref={playerHostRef} />
      </div>

      <div className="lp-player-stack">
        <div className="lp-player-label">Play Chant</div>
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

            {showExtendedControls && (
              <button
                type="button"
                className="lp-restart-button"
                onClick={handleStartOver}
                disabled={!isReady}
                aria-label="Start over"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="4" width="4" height="16" rx="1" />
                  <polygon points="21,4 8,12 21,20" />
                </svg>
              </button>
            )}

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
          </div>
          {showExtendedControls && (
            <input
              className="lp-progress-bar"
              type="range"
              min={startSeconds}
              max={endSeconds}
              step="0.05"
              value={progressValue}
              onChange={handleProgressChange}
              disabled={!isReady}
              aria-label="Chant progress"
              style={{ '--progress-percent': `${progressPercent}%` }}
            />
          )}
        </div>
      </div>
    </>
  );
});

export default YouTubeClipPlayer;
