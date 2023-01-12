import { useEffect, useState } from "react";
import { GameStatus } from "@/reducers/GameReducer";

export interface Timer {
  readonly minutes: number;
  readonly seconds: number;
  readonly totalSeconds: number;
}

export const useTimer = (status: GameStatus, limit: number): Timer => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (status === "inGame" && count <= limit) {
      const timerInterval = setInterval(() => {
        setCount(count + 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    } else {
      setCount(0);
    }

    return;
  }, [status, count, limit]);

  const getMinutesAndSeconds = (count: number) => {
    return {
      minutes: count >= 60 ? Math.floor(count / 60) : 0,
      seconds: count >= 60 ? count % 60 : count,
    };
  };

  return { ...getMinutesAndSeconds(count), totalSeconds: count };
};
