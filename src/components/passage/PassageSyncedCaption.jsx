import React from "react";
import { getArabicText } from "../../utils/arabic.js";

export default function PassageSyncedCaption({
  activeCaption,
  activePhrase,
  textMode = "none",
  arabicMode = "vocalized",
  arabicFontFamily,
  arabicFontWeight,
  onTogglePlayback
}) {
  const secondaryText = textMode === "translation"
    ? activePhrase?.translation
    : textMode === "literal"
      ? activePhrase?.literal
      : null;

  return (
    <div
      className="lp-synced-stage"
      dir="rtl"
    >
      {activePhrase && (
        <div
          className={onTogglePlayback ? "lp-synced-line active interactive" : "lp-synced-line active"}
          key={activeCaption?.phrase_id}
          role={onTogglePlayback ? "button" : undefined}
          tabIndex={onTogglePlayback ? 0 : undefined}
          aria-label={onTogglePlayback ? "Play or pause caption audio" : undefined}
          onClick={onTogglePlayback}
          onKeyDown={event => {
            if (!onTogglePlayback) return;
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            onTogglePlayback();
          }}
          style={{
            fontFamily: arabicFontFamily,
            fontWeight: arabicFontWeight
          }}
        >
          <div className="lp-synced-arabic">{getArabicText(activePhrase, arabicMode)}</div>
          {secondaryText && (
            <div className="lp-synced-translation" dir="ltr">
              {secondaryText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
