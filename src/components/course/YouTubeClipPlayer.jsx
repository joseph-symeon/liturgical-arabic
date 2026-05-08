import React, { useEffect, useRef, useState } from 'react';
import { onYouTubeReady } from '../../utils/youtube.js';

let playerCount = 0;

export default function YouTubeClipPlayer({ videoId, recordingId, startSeconds, endSeconds, defaultPlaybackRate = 1.0, onTimeUpdate }) {
  const playerIdRef = useRef(null);
  if (playerIdRef.current === null) {
    playerIdRef.current = `yt-clip-${++playerCount}`;
  }
  const playerId = playerIdRef.current;

  const playerRef = useRef(null);
  const playerHostRef = useRef(null);
  const intervalRef = useRef(null);
  const endTimerRef = useRef(null);
  const playbackRateRef = useRef(defaultPlaybackRate);
  const userStartedRef = useRef(false);
  const loopEnabledRef = useRef(true);
  const playClockRef = useRef({ mediaTime: startSeconds, wallTime: 0, playbackRate: defaultPlaybackRate });
  const playRequestedRef = useRef(false);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(defaultPlaybackRate);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [playerError, setPlayerError] = useState(null);

  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  function emitTimeUpdate(time) {
    onTimeUpdateRef.current?.(time);
  }

  function clearEndTimer() {
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }
  }

  function finishClip(player) {
    if (!player) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    clearEndTimer();
    if (!loopEnabledRef.current) {
      player.pauseVideo();
      player.seekTo(startSeconds, true);
      playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
      emitTimeUpdate(startSeconds);
      return;
    }
    player.seekTo(startSeconds, true);
    playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
    emitTimeUpdate(startSeconds);
    endTimerRef.current = setTimeout(() => {
      startLoop(player);
    }, 180);
  }

  function startLoop(player) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    clearEndTimer();
    const currentTime = player.getCurrentTime();
    if (!playRequestedRef.current) {
      playClockRef.current = { mediaTime: currentTime, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
    }
    const remainingSeconds = Math.max(0, endSeconds - currentTime);
    const playbackRate = playbackRateRef.current || 1;
    endTimerRef.current = setTimeout(() => {
      finishClip(player);
    }, Math.max(0, (remainingSeconds / playbackRate) * 1000));
    intervalRef.current = setInterval(() => {
      if (!player) return;
      const clock = playClockRef.current;
      const estimatedTime = clock.mediaTime + ((performance.now() - clock.wallTime) / 1000) * clock.playbackRate;
      emitTimeUpdate(estimatedTime);
      if (estimatedTime >= endSeconds) {
        finishClip(player);
        return;
      }
    }, 40);
  }

  useEffect(() => {
    let destroyed = false;
    setIsReady(false);
    setPlayerError(null);

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
              playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
              setIsReady(true);
            },
            onStateChange(event) {
              const { PlayerState } = window.YT;
              const state = event.data;
              if (state === PlayerState.PLAYING || state === PlayerState.BUFFERING) {
                if (!userStartedRef.current) {
                  event.target.pauseVideo();
                  event.target.seekTo(startSeconds, true);
                  playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
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
                clearEndTimer();
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
      clearEndTimer();
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
      playRequestedRef.current = false;
      player.pauseVideo();
    } else {
      const currentTime = player.getCurrentTime();
      userStartedRef.current = true;
      playRequestedRef.current = true;
      if (currentTime < startSeconds || currentTime >= endSeconds) {
        player.seekTo(startSeconds, true);
        playClockRef.current = { mediaTime: startSeconds, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
        emitTimeUpdate(startSeconds);
      } else {
        playClockRef.current = { mediaTime: currentTime, wallTime: performance.now(), playbackRate: playbackRateRef.current || 1 };
        emitTimeUpdate(currentTime);
      }
      startLoop(player);
      player.playVideo();
    }
  }

  function adjustSpeed(delta) {
    const next = Math.max(0.5, Math.min(2, Math.round((playbackRateRef.current + delta) * 10) / 10));
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
      return next;
    });
  }

  const speedDisplay = `${playbackRate.toFixed(1)}×`;

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
        </div>
      </div>
    </>
  );
}
