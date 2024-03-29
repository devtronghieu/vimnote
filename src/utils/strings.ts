interface AddStringAtIndexProps {
  baseString: string;
  stringToAdd: string;
  index: number;
}
export const addStringAtIndex = ({
  baseString,
  stringToAdd,
  index,
}: AddStringAtIndexProps) => {
  return baseString.slice(0, index) + stringToAdd + baseString.slice(index);
};

export const removeCharAtIndex = (baseString: string, index: number) => {
  return baseString.slice(0, index) + baseString.slice(index + 1);
};

interface TruncateOverflowProps {
  baseString: string;
  capacity: number;
  direction?: "front" | "back";
}
export const truncateOverflow = ({
  baseString,
  capacity,
  direction = "back",
}: TruncateOverflowProps) => {
  if (direction === "back") {
    return baseString.slice(0, capacity);
  } else {
    return baseString.slice(baseString.length - capacity);
  }
};

export const isPunctuation = (char: string): boolean => {
  const punctuationChars = [
    ",",
    ".",
    ";",
    ":",
    "!",
    "?",
    "'",
    '"',
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "-",
    "_",
    "/",
    "\\",
    "&",
    "|",
    ">",
    "<",
    "=",
    "+",
    "*",
    "%",
    "$",
    "#",
    "@",
    "~",
    "`",
    "^",
  ];
  return punctuationChars.includes(char);
};
