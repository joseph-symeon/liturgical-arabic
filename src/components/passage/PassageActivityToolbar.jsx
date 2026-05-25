import React, { useLayoutEffect, useRef } from "react";

function useToolbarReserve(ref, enabled) {
  useLayoutEffect(() => {
    if (!enabled) return undefined;

    const element = ref.current;
    const page = element?.closest(".lp-page");
    if (!element || !page) return undefined;

    let frameId = null;

    function updateReserve() {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const height = Math.ceil(element.getBoundingClientRect().height);
        page.style.setProperty("--recite-toolbar-reserve", `${height}px`);
      });
    }

    updateReserve();

    const resizeObserver = new ResizeObserver(updateReserve);
    resizeObserver.observe(element);
    window.addEventListener("resize", updateReserve);
    window.visualViewport?.addEventListener("resize", updateReserve);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateReserve);
      window.visualViewport?.removeEventListener("resize", updateReserve);
      page.style.removeProperty("--recite-toolbar-reserve");
    };
  }, [ref, enabled]);
}

export default function PassageActivityToolbar({
  activityLabel = null,
  activitySelectId = "passage-activity-select",
  activityOptions = [],
  selectedActivityValue = "",
  onSelectActivity,
  player = null,
  showKaraokeToggle = false,
  karaokeMode = false,
  onKaraokeModeChange,
  showTextModeControls = false,
  textMode = "none",
  onTextModeChange,
  textModeRequired = false,
  textModeLabel = "Phrase caption text",
  textModeOptions = [
    ["translation", "Translation"],
    ["literal", "Literal"]
  ],
  toolbarTop = null,
  hidden = false
}) {
  const toolbarShellRef = useRef(null);
  const hasActivity = Boolean(activityLabel);
  const hasModes = showKaraokeToggle || showTextModeControls;
  useToolbarReserve(toolbarShellRef, !hidden);

  if (!hasActivity && !player && !hasModes) return null;

  const modeControls = hasModes ? (
    <div className="lp-mode-toggle-row lp-activity-mode-row" dir="ltr">
      {showKaraokeToggle && (
        <button
          type="button"
          className={`lp-karaoke-mode-button${karaokeMode ? " active" : ""}`}
          aria-pressed={karaokeMode}
          onClick={() => onKaraokeModeChange?.(!karaokeMode)}
        >
          Karaoke
        </button>
      )}

      {showTextModeControls && (
        <div className="lp-segmented-control" role="group" aria-label={textModeLabel}>
          {textModeOptions.map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              className={textMode === mode ? "active" : ""}
              aria-pressed={textMode === mode}
              onClick={() => onTextModeChange?.(textModeRequired || textMode !== mode ? mode : "none")}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  ) : null;

  return (
    <>
      {(hasActivity || player) && (
        <div ref={toolbarShellRef} className={hidden ? "lp-activity-toolbar-shell hidden" : "lp-activity-toolbar-shell"}>
          {toolbarTop && (
            <div className="lp-activity-toolbar-top">
              {toolbarTop}
            </div>
          )}
          <div className={`lp-activity-toolbar${hasModes ? " has-mode-controls" : ""}`}>
            {hasActivity && (
              <div className="lp-activity-controls">
                <label className="lp-activity-control-label" htmlFor={activitySelectId}>Activity</label>
                <div className="lp-activity-card">
                  <div className="lp-activity-field">
                    {activityOptions.length > 1 ? (
                      <select
                        id={activitySelectId}
                        className="lp-activity-select"
                        value={selectedActivityValue}
                        onChange={event => onSelectActivity?.(event.target.value)}
                      >
                        {activityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="lp-activity-static">{activityLabel}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {player && (
              <div className="lp-toolbar-player">
                {player}
              </div>
            )}

            {modeControls && (
              <div className="lp-toolbar-mode-controls">
                {modeControls}
              </div>
            )}
          </div>
        </div>
      )}
      {modeControls && !player && !hasActivity && (
        <div className={hidden ? "lp-mode-controls-shell hidden" : "lp-mode-controls-shell"}>
          {modeControls}
        </div>
      )}
    </>
  );
}
