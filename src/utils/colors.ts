export const getHexColorNumber = (color: string): number => {
  const hexWithoutHash = color.startsWith("#") ? color.slice(1) : color;
  const decimalColor = parseInt(hexWithoutHash, 16);
  return decimalColor;
};
