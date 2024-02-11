import { expect } from "chai";
import { separateWordsIncludePunctuationMarks } from "./strings";

describe("Separate words", () => {
  const baseString = "xin chao, hieu dep trai!";

  it("Test 1", () => {
    const { separatedWords, endIndex } = separateWordsIncludePunctuationMarks({
      baseString,
      startIndex: 1,
      numberOfWords: 3,
    });

    const expectedSeparatedWords = ["in ", "chao", ", "];
    const expectedEndIndex = 9;

    expect(separatedWords).to.eql(expectedSeparatedWords);
    expect(endIndex).to.eq(expectedEndIndex);
  });

  it("Test 2", () => {
    const { separatedWords, endIndex } = separateWordsIncludePunctuationMarks({
      baseString,
      startIndex: 1,
      numberOfWords: 20,
    });

    const expectedSeparatedWords = [
      "in ",
      "chao",
      ", ",
      "hieu ",
      "dep ",
      "trai",
      "!",
    ];
    const expectedEndIndex = baseString.length - 1;

    expect(separatedWords).to.eql(expectedSeparatedWords);
    expect(endIndex).to.eq(expectedEndIndex);
  });
});
