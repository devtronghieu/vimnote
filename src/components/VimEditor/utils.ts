export const defaultCols = 20;

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

export const renderLineNumbers = (
  lineNumbersEle: HTMLDivElement,
  textAreaEle: HTMLTextAreaElement,
) => {
  const lines = textAreaEle.value.split("\n");

  const lineNumbers: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    lineNumbers.push(i + 1);
    const emptyLines = Math.floor(lines[i].length / textAreaEle.cols);
    Array.from({ length: emptyLines }).forEach(() => lineNumbers.push(0));
  }

  lineNumbersEle.innerHTML = lineNumbers
    .map((num) => (num !== 0 ? `<p>${num}</p>` : "<p>&nbsp;</p>"))
    .join("");
};

export const getCols = (textAreaEle: HTMLTextAreaElement) => {
  const charWidth = getCharSize(textAreaEle.style.font).charWidth;
  const textWidth = textAreaEle.clientWidth;
  return Math.floor(textWidth / charWidth);
};
