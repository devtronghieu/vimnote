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

interface SeparateWordsIncludePunctuationMarksProps {
  baseString: string;
  index: number;
  numberOfWords: number;
}
export const separateWordsIncludePunctuationMarks = ({
  baseString,
  index,
  numberOfWords,
}: SeparateWordsIncludePunctuationMarksProps): {
  separatedWords: string[];
  endIndex: number;
} => {
  const punctuationMarks = [",", ".", ";", ":", "!", "?"];
  const separatedWords: string[] = [];
  let currentWord = "";
  let endIndex = index;

  while (
    endIndex < baseString.length &&
    separatedWords.length < numberOfWords
  ) {
    currentWord = baseString[endIndex];
    const isPunc = punctuationMarks.includes(currentWord);
    endIndex++;

    if (isPunc) {
      while (baseString[endIndex] === " ") {
        currentWord += " ";
        endIndex++;
      }
      separatedWords.push(currentWord);
      currentWord = "";
    } else {
      while (!punctuationMarks.includes(baseString[endIndex])) {
        if (baseString[endIndex] !== " " && baseString[endIndex - 1] === " ") {
          break;
        }
        currentWord += baseString[endIndex];
        endIndex++;
      }
      separatedWords.push(currentWord);
      currentWord = "";
    }
  }

  return {
    separatedWords,
    endIndex,
  };
};
