import React from "react";

export default function PhraseTooltip({ phrase }) {
  return (
    <span className="grid max-w-72 grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2 gap-y-1">
      <span className="text-stone-500 dark:text-stone-400">Translation</span>
      <span>{phrase.translation}</span>
      <span className="text-stone-500 dark:text-stone-400">Literal</span>
      <span>{phrase.literal}</span>
    </span>
  );
}
