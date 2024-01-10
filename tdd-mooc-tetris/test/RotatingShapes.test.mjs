import { describe, test } from "vitest";
import { expect } from "chai";
import { RotatingShape } from "../src/RotatingShape.mjs";

describe("Rotating 3x3 shape", () => {
  const shape = new RotatingShape(
    `ABC
     DEF
     GHI`
  );

  test("initial orientation", () => {
    expect(shape.toString()).to.equalShape(
      `ABC
       DEF
       GHI`
    );
  });

  test("can be rotated right/clockwise", () => {
    expect(shape.rotateRight().toString()).to.equalShape(
      `GDA
       HEB
       IFC`
    );
  });

  test("can be rotated left/counter-clockwise", () => {
    expect(shape.rotateLeft().toString()).to.equalShape(
      `CFI
       BEH
       ADG`
    );
  });

  test("symbolAt returns correct symbol for row/col", () => {
    `ABCDEFGHI`.split("").forEach((c, i) =>
      expect(shape.symbolAt(Math.floor(i/3), i%3)).to.equal(c)
    );
  });
});

describe("Rotating 5x5 shape", () => {
  const shapeUpright =
    `ABCDE
     FGHIJ
     KLMNO
     PQRST
     UVWXY`;
  const shapeRightRotated =
    `UPKFA
     VQLGB
     WRMHC
     XSNID
     YTOJE`;
  const shapeDownRotated =
    `YXWVU
     TSRQP
     ONMLK
     JIHGF
     EDCBA`;
  const shapeLeftRotated =
    `EJOTY
     DINSX
     CHMRW
     BGLQV
     AFKPU`;

  const shape = new RotatingShape(shapeUpright);

  test("initial orientation", () => {
    expect(shape.toString()).to.equalShape(
      `ABCDE
       FGHIJ
       KLMNO
       PQRST
       UVWXY`
    );
  });

  test("can be rotated right/clockwise", () => {
    expect(shape.rotateRight().toString()).to.equalShape(shapeRightRotated);
  });

  test("can be rotated right/clockwise 2 times", () => {
    expect(shape
      .rotateRight()
      .rotateRight()
      .toString()
    ).to.equalShape(shapeDownRotated);
  });

  test("can be rotated right/clockwise 3 times", () => {
    expect(shape
      .rotateRight()
      .rotateRight()
      .rotateRight()
      .toString()
    ).to.equalShape(shapeLeftRotated);
  });

  test("Rotated right/clockwise 4 times resets to original shape", () => {
    expect(shape
      .rotateRight()
      .rotateRight()
      .rotateRight()
      .rotateRight()
      .toString()
    ).to.equalShape(shapeUpright);
  });

  test("can be rotated left/counter-clockwise", () => {
    expect(shape.rotateLeft().toString()).to.equalShape(shapeLeftRotated);
  });

  test("can be rotated left/counter-clockwise 2 times", () => {
    expect(shape
      .rotateLeft()
      .rotateLeft()
      .toString()
    ).to.equalShape(shapeDownRotated);
  });

  test("can be rotated left/counter-clockwise 3 times", () => {
    expect(shape
      .rotateLeft()
      .rotateLeft()
      .rotateLeft()
      .toString()
    ).to.equalShape(shapeRightRotated);
  });

  test("Rotated left/counter-clockwise 4 times resets to original shape", () => {
    expect(shape
      .rotateLeft()
      .rotateLeft()
      .rotateLeft()
      .rotateLeft()
      .toString()
    ).to.equalShape(shapeUpright);
  });

  test("symbolAt returns correct symbol for row/col", () => {
    shapeUpright
      .replaceAll(" ", "")
      .replaceAll("\n", "")
      .split("")
      .forEach((c, i) =>
        expect(shape.symbolAt(Math.floor(i/5), i%5)).to.equal(c)
      );
  });
});
