import { useEffect, useState } from "react";

export const useCountdown = (enabled: boolean): number => {
  const [count, setCount] = useState(2);

  // Listen for countdown state and initiate countdown
  useEffect(() => {
    if (enabled && count > 0) {
      const countdownTimeout = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(countdownTimeout);
    } else {
      setCount(2);
    }

    return;
  }, [enabled, count]);

  return count;
};
