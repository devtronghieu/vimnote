import { expect } from "chai";
import { separateWordsIncludePunctuationMarks } from "./strings";

describe("String utils", () => {
  const baseString = "xin chao, hieu dep trai!";

  it("Seperate words", () => {
    const { separatedWords, endIndex } = separateWordsIncludePunctuationMarks({
      baseString,
      index: 1,
      numberOfWords: 3,
    });

    const expectedSeparatedWords = ["in ", "chao", ", "];
    const expectedEndIndex = 10;

    expect(separatedWords).to.eql(expectedSeparatedWords);
    expect(endIndex).to.eq(expectedEndIndex);
  });
});
