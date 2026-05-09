import React from "react";
import SpeakerBlock from "../SpeakerBlock.jsx";

export default function PassageRenderer({
  section,
  arabicMode,
  readerLayout,
  speechRate,
  arabicFontFamily,
  arabicFontWeight,
  arabicFontSize,
  activeCaption = null,
  showSectionHeading = false
}) {
  return (
    <SpeakerBlock
      section={section}
      arabicMode={arabicMode}
      readerLayout={readerLayout}
      speechRate={speechRate}
      arabicFontFamily={arabicFontFamily}
      arabicFontWeight={arabicFontWeight}
      arabicFontSize={arabicFontSize}
      activeCaption={activeCaption}
      showSectionHeading={showSectionHeading}
    />
  );
}
