import { useEffect, useState } from "react";
import { GameState } from "./useGame.types";

interface Timer {
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export const useTimer = (status: GameState["status"]): Timer => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (status === "inGame" && count < 120) {
      const timerInterval = setInterval(() => {
        setCount(count + 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    } else {
      setCount(0);
    }
  }, [status, count]);

  const getMinutesAndSeconds = (count: number): Timer => {
    return {
      minutes: count >= 60 ? Math.floor(count / 60) : 0,
      seconds: count >= 60 ? count % 60 : count,
      totalSeconds: count,
    };
  };

  return getMinutesAndSeconds(count);
};
