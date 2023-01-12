import { useEffect, useState } from "react";
import { GameStatus } from "@/reducers/GameReducer";

export const useCountdown = (status: GameStatus): number => {
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

    return;
  }, [status, count]);

  return count;
};
