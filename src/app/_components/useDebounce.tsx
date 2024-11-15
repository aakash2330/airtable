"use client";

import { useEffect, useState } from "react";

export function useDebouce({ value, time }: { value: string; time: number }) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedValue(value);
    }, time);
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [value]);
  return debouncedValue;
}
