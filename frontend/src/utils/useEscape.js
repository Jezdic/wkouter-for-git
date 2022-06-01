import { useRef, useEffect, useCallback } from "react";

export default function useEventListener(setToggle, element = window) {
  const savedHandler = useRef();

  const handler = useCallback(
    (e) => {
      if (e.key === "Escape") setToggle(false);
    },
    [setToggle]
  );

  useEffect(() => {
    savedHandler.current = handler;
  }, [setToggle, handler]);
  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener("keyup", eventListener);
    return () => {
      element.removeEventListener("keyup", eventListener);
    };
  }, [element]);
}
