
import { useState, useEffect, useRef } from "react";

interface UseCounterProps {
  start?: number;
  end: number;
  duration?: number;
  viewportMargin?: string;
}

export function useCounter({
  start = 0,
  end,
  duration = 2.5,
  viewportMargin = "0px"
}: UseCounterProps): number {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Create a target div to observe if it doesn't exist
    if (!targetRef.current) {
      targetRef.current = document.createElement("div");
      targetRef.current.style.position = "absolute";
      targetRef.current.style.top = "0";
      targetRef.current.style.left = "0";
      targetRef.current.style.width = "100%";
      targetRef.current.style.height = "100%";
      targetRef.current.style.pointerEvents = "none";
      document.body.appendChild(targetRef.current);
    }

    // Create an IntersectionObserver to determine when the counter should start
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { rootMargin: viewportMargin }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
      if (targetRef.current && targetRef.current.parentNode === document.body) {
        document.body.removeChild(targetRef.current);
      }
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      targetRef.current = null;
    };
  }, [viewportMargin, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const animateCount = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const progress = (timestamp - startTimeRef.current) / (duration * 1000);
      
      if (progress < 1) {
        const currentCount = Math.floor(start + progress * (end - start));
        setCount(currentCount);
        frameRef.current = requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    frameRef.current = requestAnimationFrame(animateCount);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [start, end, duration, hasStarted]);

  return count;
}
