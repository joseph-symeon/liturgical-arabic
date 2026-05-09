import React from "react";
import { getArabicText } from "../../utils/arabic.js";

export default function PassageSyncedCaption({
  activeCaption,
  activePhrase,
  textMode = "none",
  arabicMode = "vocalized",
  arabicFontFamily,
  arabicFontWeight
}) {
  const secondaryText = textMode === "translation"
    ? activePhrase?.translation
    : textMode === "literal"
      ? activePhrase?.literal
      : null;

  return (
    <div className="lp-synced-stage" dir="rtl">
      {activePhrase && (
        <div
          className="lp-synced-line active"
          key={activeCaption?.phrase_id}
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
