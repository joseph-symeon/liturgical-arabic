import React from "react";
import BilingualTitle from "./BilingualTitle.jsx";

export default function PageHeader({
  eyebrow,
  title,
  secondaryTitle,
  titlePhrase,
  arabicMode,
  speechRate,
  arabicFontFamily,
  arabicFontWeight = "500",
  align = "left"
}) {
  const alignmentClass = align === "center" ? "text-center" : "text-left";
  const titleClass = `text-2xl font-medium leading-tight md:text-3xl ${alignmentClass}`;

  return (
    <header className="mb-8" dir="ltr">
      {eyebrow && (
        <div className={`mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-[var(--dark-muted)] ${alignmentClass}`}>
          {eyebrow}
        </div>
      )}
      {titlePhrase ? (
        <BilingualTitle
          as="h1"
          english={title}
          phraseId={titlePhrase}
          arabicMode={arabicMode}
          speechRate={speechRate}
          arabicFontFamily={arabicFontFamily}
          arabicFontWeight={arabicFontWeight}
          className={titleClass}
        />
      ) : (
        <h1 className={titleClass}>{title}</h1>
      )}
      {secondaryTitle && (
        <div className={`mt-3 text-lg font-normal text-stone-500 dark:text-[var(--dark-muted)] ${alignmentClass}`}>
          {secondaryTitle}
        </div>
      )}
    </header>
  );
}
