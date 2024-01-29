import { useState, useEffect } from "react";

export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [isThrottled, setIsThrottled] = useState<boolean>(false);

  useEffect(() => {
    if (!isThrottled) {
      setThrottledValue(value);
      setIsThrottled(true);

      const timeoutId = setTimeout(() => {
        setIsThrottled(false);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [value, isThrottled, delay]);

  return throttledValue;
};
