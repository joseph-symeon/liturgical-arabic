import React from "react";
import { getArabicText } from "../../utils/arabic.js";

export default function PassageSyncedCaption({
  activeCaption,
  activePhrase,
  activePhrases,
  textMode = "none",
  arabicMode = "vocalized",
  arabicFontFamily,
  arabicFontWeight,
  onTogglePlayback
}) {
  const displayedPhrases = activePhrases?.length
    ? activePhrases
    : activePhrase
      ? [activePhrase]
      : [];
  const secondaryText = textMode === "translation"
    ? displayedPhrases.map(phrase => phrase?.translation).filter(Boolean).join(" ")
    : textMode === "literal"
      ? displayedPhrases.map(phrase => phrase?.literal).filter(Boolean).join(" ")
      : null;

  return (
    <div
      className="lp-synced-stage"
      dir="rtl"
    >
      {displayedPhrases.length > 0 && (
        <div
          className={[
            "lp-synced-line active",
            onTogglePlayback ? "interactive" : null
          ].filter(Boolean).join(" ")}
          key={activeCaption?.display_key || activeCaption?.phrase_id}
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
          <div className="lp-synced-arabic">
            {displayedPhrases.map(phrase => getArabicText(phrase, arabicMode)).join(" ")}
          </div>
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
