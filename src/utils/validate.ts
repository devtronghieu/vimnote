export const isAlphanumeric = (input: string): boolean => {
  const alphanumericRegex = /^[a-z0-9]+$/i;
  return alphanumericRegex.test(input);
};

export const isFunctionKey = (key: string): boolean => {
  const functionKeys = [
    "Shift",
    "Control",
    "Alt",
    "Meta",
    "CapsLock",
    "Enter",
    "Tab",
    "Escape",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    "PageUp",
    "PageDown",
    "Insert",
    "Backspace",
    "Delete",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
  ];

  return functionKeys.includes(key);
};
