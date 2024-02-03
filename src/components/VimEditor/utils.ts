import { LineMap } from "@/state/vim";

export const getCharSize = (font: string) => {
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
  const charHeight = hiddenDiv.clientHeight;
  document.body.removeChild(hiddenDiv);
  return {
    charWidth,
    charHeight,
  };
};

export const getTotalCols = (textAreaEle: HTMLTextAreaElement) => {
  const computedStyle = window.getComputedStyle(textAreaEle);
  const contentWidth =
    textAreaEle.clientWidth -
    parseInt(computedStyle.paddingLeft) -
    parseInt(computedStyle.paddingRight);
  return (
    Math.floor(contentWidth / getCharSize(computedStyle.font).charWidth) + 1
  );
};

export const renderLineNumbers = (
  textAreaEle: HTMLTextAreaElement,
): LineMap => {
  const lineMap: LineMap = new Map();

  const lines = textAreaEle.value.split("\n");

  for (let i = 0; i < lines.length; i++) {
    let emptyLines = Math.floor(lines[i].length / textAreaEle.cols);
    if (lines[i].length % textAreaEle.cols === 0) emptyLines--;
    lineMap.set(i, emptyLines > 0 ? 1 + emptyLines : 1);
  }

  return lineMap;
};
