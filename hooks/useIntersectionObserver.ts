import { useEffect, MutableRefObject } from "react";

interface Parameters {
  target: MutableRefObject<HTMLElement | null>;
  onIntersect: () => void;
  enabled: boolean | undefined;
  threshold?: number;
  rootMargin?: string;
}

export const useIntersectionObserver = ({
  target,
  onIntersect,
  enabled = true,
  threshold = 1.0,
  rootMargin = "0px",
}: Parameters): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        rootMargin,
        threshold,
      }
    );

    const el = target && target.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => observer.unobserve(el);
  }, [target.current, enabled]);
};
