"use client";

import { useState, useEffect, useCallback } from "react";

export const useCountdown = (
  initialSeconds: number,
  onComplete: () => void,
) => {
  const [countdown, setCountdown] = useState(initialSeconds);

  useEffect(() => {
    if (countdown <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onComplete]);

  const resetCountdown = useCallback(() => {
    setCountdown(initialSeconds);
  }, [initialSeconds]);

  return { countdown, resetCountdown };
};
