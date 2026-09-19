import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);

    const scrollNow = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    };

    let debounceId: ReturnType<typeof setTimeout>;
    const scheduleScroll = () => {
      clearTimeout(debounceId);
      debounceId = setTimeout(scrollNow, 200);
    };

    scrollNow();
    scheduleScroll();

    const observer = new MutationObserver(scheduleScroll);
    observer.observe(document.body, { childList: true, subtree: true });

    const stopId = setTimeout(() => observer.disconnect(), 2500);

    return () => {
      observer.disconnect();
      clearTimeout(debounceId);
      clearTimeout(stopId);
    };
  }, [hash]);
}
