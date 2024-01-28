import { useState, useEffect, Dispatch, SetStateAction } from "react";

type SetValue<T> = Dispatch<SetStateAction<T>>;

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, SetValue<T>] => {
  const storedValue = localStorage.getItem(key);

  const [value, setValue] = useState<T>(
    storedValue ? JSON.parse(storedValue) : initialValue,
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
