import React, { useLayoutEffect, useRef } from "react";

function useDrawerReserve(ref, enabled) {
  useLayoutEffect(() => {
    if (!enabled) return undefined;

    const element = ref.current;
    const page = element?.closest(".lp-page");
    if (!element || !page) return undefined;

    let frameId = null;

    function updateReserve() {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const height = Math.ceil(element.offsetHeight);
        page.style.setProperty("--recite-toolbar-reserve", `${height}px`);
      });
    }

    updateReserve();

    const resizeObserver = new ResizeObserver(updateReserve);
    resizeObserver.observe(element);
    window.addEventListener("resize", updateReserve);
    window.visualViewport?.addEventListener("resize", updateReserve);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateReserve);
      window.visualViewport?.removeEventListener("resize", updateReserve);
      page.style.removeProperty("--recite-toolbar-reserve");
    };
  }, [ref, enabled]);
}

export default function PassageBottomDrawer({
  top = null,
  middle = null,
  action = null,
  bottom = null,
  children = null,
  className = "",
  hidden = false,
  drawerRef = null
}) {
  const internalRef = useRef(null);
  const resolvedRef = drawerRef || internalRef;
  useDrawerReserve(resolvedRef, !hidden);

  if (hidden || (!top && !middle && !action && !bottom && !children)) return null;

  return (
    <div ref={resolvedRef} className={["lp-activity-toolbar-shell", bottom ? "has-bottom-row" : "", className].filter(Boolean).join(" ")}>
      {children || (
        <>
          {top && (
            <div className="lp-activity-toolbar-top">
              {top}
            </div>
          )}
          {middle && (
            <div className="lp-activity-toolbar-middle">
              {middle}
            </div>
          )}
          {action && (
            <div className="lp-activity-toolbar-action">
              {action}
            </div>
          )}
          {bottom && (
            <div className="lp-activity-toolbar-bottom">
              {bottom}
            </div>
          )}
        </>
      )}
    </div>
  );
}
