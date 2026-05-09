const ACTIVITY_SELECTION_STORAGE_KEY = "liturgical-arabic:activity-selection";

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
