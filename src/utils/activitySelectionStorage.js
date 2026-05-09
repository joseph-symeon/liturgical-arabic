const ACTIVITY_SELECTION_STORAGE_KEY = "liturgical-arabic:activity-selection";
export const SHARED_ACTIVITY_SELECTION_KEY = "shared:passage-activity";

export function getStoredActivitySelections() {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(ACTIVITY_SELECTION_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function getStoredActivitySelection(selectionKey, allowedValues) {
  const storedValue = getStoredActivitySelections()[selectionKey];
  return allowedValues.includes(storedValue) ? storedValue : null;
}

export function storeActivitySelection(selectionKey, activityValue) {
  if (typeof window === "undefined" || !selectionKey || !activityValue) return;

  window.localStorage.setItem(ACTIVITY_SELECTION_STORAGE_KEY, JSON.stringify({
    ...getStoredActivitySelections(),
    [selectionKey]: activityValue
  }));
}

export function resolveStoredActivitySelection(selectionKey, allowedValues, fallbackValue) {
  const allowed = (allowedValues || []).filter(Boolean);
  if (allowed.length === 0) return null;

  const storedValue = getStoredActivitySelection(selectionKey, allowed);
  const resolvedValue = storedValue || (
    fallbackValue && allowed.includes(fallbackValue)
      ? fallbackValue
      : allowed[0]
  );

  if (resolvedValue && resolvedValue !== storedValue) {
    storeActivitySelection(selectionKey, resolvedValue);
  }

  return resolvedValue;
}
