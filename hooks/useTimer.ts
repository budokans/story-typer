import { useEffect, useState } from "react";

export interface Timer {
  readonly minutes: number;
  readonly seconds: number;
  readonly totalSeconds: number;
}

export const useTimer = (isEnabled: boolean, limit: number): Timer => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isEnabled && count <= limit) {
      const timerInterval = setInterval(() => {
        setCount(count + 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    } else {
      setCount(0);
    }

    return;
  }, [isEnabled, count, limit]);

  const getMinutesAndSeconds = (count: number) => {
    return {
      minutes: count >= 60 ? Math.floor(count / 60) : 0,
      seconds: count >= 60 ? count % 60 : count,
    };
  };

  return { ...getMinutesAndSeconds(count), totalSeconds: count };
};

export const timerDisplay = (timer: Timer): string =>
  timer.seconds < 10
    ? `${timer.minutes}:0${timer.seconds}`
    : `${timer.minutes}:${timer.seconds}`;
