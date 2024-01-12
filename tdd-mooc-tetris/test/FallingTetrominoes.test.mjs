import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";

const BOARD_HEIGHT = 10;
const BOARD_WIDTH = 6;

function fallToBottom(board) {
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    board.tick();
  }
}

function callFuncRepeatedly(times, directionCb) {
  for (let i = 0; i < times; i++) {
    directionCb();
  }
}

describe("Falling tetrominoes", () => {
  let board;
  beforeEach(() => {
    board = new Board(BOARD_HEIGHT, BOARD_WIDTH);
  });

  test("start from the top middle", () => {
    board.drop(Tetromino.T_SHAPE);

    expect(board.toString()).to.equalShape(
      `....T.....
       ...TTT....
       ..........
       ..........
       ..........
       ..........`
    );
  });

  test("stop when they hit the bottom", () => {
    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);
    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ..........
       ..........
       ....T.....
       ...TTT....`
    );
  });

  test("stop when they land on another block", () => {
    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);
    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);

    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ....T.....
       ...TTT....
       ....T.....
       ...TTT....`
    );
  });

  test("wont drop if would collide with existing", () => {
    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);
    board.drop(Tetromino.O_SHAPE);
    callFuncRepeatedly(2, () => board.moveLeft());
    fallToBottom(board);
    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);
    board.drop(Tetromino.T_SHAPE);

    expect(board.toString()).to.equalShape(
      `..........
       ....T.....
       ...TTT....
       ..OO......
       ..OOT.....
       ...TTT....`
    );
  });

  describe("Can be moved", () => {
    beforeEach(() => {
      board.drop(Tetromino.T_SHAPE);
    });

    describe("In left direction", () => {
      beforeEach(() => {
        board.moveLeft();
      });

      test("by one column", () => {
        expect(board.toString()).to.equalShape(
          `...T......
           ..TTT.....
           ..........
           ..........
           ..........
           ..........`
        );
      });

      test("to the wall", () => {
        callFuncRepeatedly(2, () => board.moveLeft());
        expect(board.toString()).to.equalShape(
          `.T........
           TTT.......
           ..........
           ..........
           ..........
           ..........`
        );
      });

      test("to the wall but not beyond", () => {
        callFuncRepeatedly(2*BOARD_WIDTH, () => board.moveLeft());
        expect(board.toString()).to.equalShape(
          `.T........
           TTT.......
           ..........
           ..........
           ..........
           ..........`
        );
      });
    });

    describe("In right direction", () => {
      beforeEach(() => {
        board.moveRight();
      });

      test("by one column", () => {
        expect(board.toString()).to.equalShape(
          `.....T....
           ....TTT...
           ..........
           ..........
           ..........
           ..........`
        );
      });

      test("to the wall", () => {
        callFuncRepeatedly(3, () => board.moveRight());
        expect(board.toString()).to.equalShape(
          `........T.
           .......TTT
           ..........
           ..........
           ..........
           ..........`
        );
      });

      test("to the wall but not beyond", () => {
        callFuncRepeatedly(2*BOARD_WIDTH, () => board.moveRight());
        expect(board.toString()).to.equalShape(
          `........T.
           .......TTT
           ..........
           ..........
           ..........
           ..........`
        );
      });
    });

    describe("Downwards", () => {
      beforeEach(() => {
        board.moveDown();
      })

      test("by one row", () => {
        expect(board.toString()).to.equalShape(
          `..........
           ....T.....
           ...TTT....
           ..........
           ..........
           ..........`
        );
      });

      test("to floor", () => {
        callFuncRepeatedly(3, () => board.moveDown());
        expect(board.toString()).to.equalShape(
          `..........
           ..........
           ..........
           ..........
           ....T.....
           ...TTT....`
        );
      });

      describe("When it reaches the floor", () => {
        beforeEach(() => {
          callFuncRepeatedly(3, () => board.tick());
        });

        test("it is still moving on the last row", () => {
          expect(board.toString()).to.equalShape(
            `..........
             ..........
             ..........
             ..........
             ....T.....
             ...TTT....`
          );
          expect(board.hasFalling()).to.be.true;
        });

        test("it stops when it hits the floor", () => {
          board.tick();
          expect(board.toString()).to.equalShape(
            `..........
             ..........
             ..........
             ..........
             ....T.....
             ...TTT....`
          );
          expect(board.hasFalling()).to.be.false;
        });

        test("it stays on the floor after stopping", () => {
          fallToBottom(board);
          expect(board.toString()).to.equalShape(
            `..........
             ..........
             ..........
             ..........
             ....T.....
             ...TTT....`
          );
          expect(board.hasFalling()).to.be.false;
        })
      });
    });

    describe("But wont move trough other blocks", () => {
      beforeEach(() => {
        fallToBottom(board);
        board.drop(Tetromino.T_SHAPE);
        callFuncRepeatedly(3, () => board.moveLeft());
        fallToBottom(board);
        board.drop(Tetromino.I_SHAPE.rotateRight());
        callFuncRepeatedly(3, () => board.moveRight());
        fallToBottom(board);
        board.drop(Tetromino.T_SHAPE.rotateRight());
        callFuncRepeatedly(3, () => board.moveLeft());
        fallToBottom(board);
      });

      test.skip("in right direction", () => {
        board.drop(Tetromino.O_SHAPE);
        board.tick();
        callFuncRepeatedly(10, () => board.moveRight());
        expect(board.toString()).to.equalShape(
          `..........
           .T...OO...
           .TT..OOI..
           .T.....I..
           .T..T..I..
           TTTTTT.I..`
        );
        board.tick();
        callFuncRepeatedly(10, () => board.moveRight());
        expect(board.toString()).to.equalShape(
          `..........
           .T........
           .TT..OOI..
           .T...OOI..
           .T..T..I..
           TTTTTT.I..`
        );
      });

      test.skip("in left direction", () => {
        board.drop(Tetromino.O_SHAPE);
        board.tick();
        callFuncRepeatedly(10, () => board.moveLeft());
        expect(board.toString()).to.equalShape(
          `..........
           .T.OO.....
           .TTOO..I..
           .T.....I..
           .T..T..I..
           TTTTTT.I..`
        );
        board.tick();
        callFuncRepeatedly(10, () => board.moveLeft());
        expect(board.toString()).to.equalShape(
          `..........
           .T........
           .TTOO..I..
           .T.OO..I..
           .T..T..I..
           TTTTTT.I..`
        );
      });

      test.skip("when moving down and stops when hitting", () => {
        board.drop(Tetromino.T_SHAPE.rotateRight().rotateRight());
        fallToBottom(board);
        expect(board.toString()).to.equalShape(
          `..........
           .T........
           .TTTTT.I..
           .T..T..I..
           .T..T..I..
           TTTTTT.I..`
        );
        expect(board.hasFalling()).to.be.false;
      });
    });
  });

});
