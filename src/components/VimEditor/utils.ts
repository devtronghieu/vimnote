export const defaultCols = 20;

export const getCharWidth = (font: string) => {
  const hiddenDiv = document.createElement("div");
  hiddenDiv.style.position = "absolute";
  hiddenDiv.style.top = "-9999px";
  hiddenDiv.style.visibility = "hidden";
  hiddenDiv.style.font = font;
  hiddenDiv.style.width = "auto";
  hiddenDiv.style.whiteSpace = "nowrap";
  hiddenDiv.innerText = "X";
  document.body.appendChild(hiddenDiv);
  const charWidth = hiddenDiv.clientWidth;
  document.body.removeChild(hiddenDiv);
  return charWidth;
};
