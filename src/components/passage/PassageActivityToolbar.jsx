import React from "react";
import PassageBottomDrawer from "./PassageBottomDrawer.jsx";

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
  toolbarMiddle = null,
  suppressModeControls = false,
  hidden = false
}) {
  const hasActivity = Boolean(activityLabel);
  const hasModes = showKaraokeToggle || showTextModeControls;
  const hasToolbarTop = Boolean(toolbarTop);
  const hasToolbarMiddle = Boolean(toolbarMiddle);

  if (hidden) return null;

  if (!hasActivity && !player && !hasModes && !hasToolbarTop && !hasToolbarMiddle) return null;

  const modeControls = hasModes && !suppressModeControls ? (
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
      {(hasActivity || player || hasToolbarTop || hasToolbarMiddle) && (
        <PassageBottomDrawer
          top={toolbarTop}
          middle={toolbarMiddle}
          action={(hasActivity || player || hasModes) ? (
            <div className="lp-activity-toolbar">
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
          ) : null}
        />
      )}
      {modeControls && !player && !hasActivity && (
        <div className={hidden ? "lp-mode-controls-shell hidden" : "lp-mode-controls-shell"}>
          {modeControls}
        </div>
      )}
    </>
  );
}
