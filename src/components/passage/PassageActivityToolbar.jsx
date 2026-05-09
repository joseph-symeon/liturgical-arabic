import React from "react";

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
  hidden = false
}) {
  const hasActivity = Boolean(activityLabel);
  const hasModes = showKaraokeToggle || showTextModeControls;

  if (!hasActivity && !player && !hasModes) return null;

  return (
    <div className={hidden ? "lp-activity-toolbar-shell hidden" : "lp-activity-toolbar-shell"}>
      <div className="lp-activity-toolbar">
        <div className="lp-activity-controls">
          {hasActivity && (
            <>
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
            </>
          )}
        </div>

        <div className="lp-toolbar-player">
          {player}
        </div>
      </div>

      {hasModes && (
        <div className="lp-mode-toggle-row lp-activity-mode-row" dir="ltr">
          {showKaraokeToggle && (
            <label className="lp-mode-toggle">
              <input
                type="checkbox"
                checked={karaokeMode}
                onChange={event => onKaraokeModeChange?.(event.target.checked)}
              />
              <span className="lp-mode-switch" aria-hidden="true" />
              <span>Karaoke mode</span>
            </label>
          )}

          {showTextModeControls && (
            <div className="lp-segmented-control" role="group" aria-label="Phrase caption text">
              {[
                ["translation", "Translation"],
                ["literal", "Literal"]
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  className={textMode === mode ? "active" : ""}
                  aria-pressed={textMode === mode}
                  onClick={() => onTextModeChange?.(textMode === mode ? "none" : mode)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
