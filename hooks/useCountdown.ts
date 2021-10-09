import { useEffect, useState } from "react";
import { GameState } from "./types/Game.types";

export const useCountdown = (status: GameState["status"]): number => {
  const [count, setCount] = useState(2);

  // Listen for countdown state and initiate countdown
  useEffect(() => {
    if (status === "countdown" && count > 0) {
      const countdownTimeout = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(countdownTimeout);
    } else {
      setCount(2);
    }
  }, [status, count]);

  return count;
};
