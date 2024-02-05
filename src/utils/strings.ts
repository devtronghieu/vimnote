export const addStringAtIndex = ({
  baseString,
  stringToAdd,
  index,
}: {
  baseString: string;
  stringToAdd: string;
  index: number;
}) => {
  return baseString.slice(0, index) + stringToAdd + baseString.slice(index);
};

export const removeCharAtIndex = (s: string, index: number) => {
  return s.slice(0, index) + s.slice(index + 1);
};
