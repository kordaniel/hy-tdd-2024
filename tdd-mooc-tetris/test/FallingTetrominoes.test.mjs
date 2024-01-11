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

  /**
   * TODO: ADD TEST CASES:
   * - ASSERT TETROMINO IS NOT MOVING AFTER HITTING OTHER ONE
   * - ASSERT TETROMINO CAN NOT MOVE LEFT/RIGHT OVER OTHER ONE
   */

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
        board.moveLeft();
        board.moveLeft();
        expect(board.toString()).to.equalShape(
          `.T........
           TTT.......
           ..........
           ..........
           ..........
           ..........`
        );
      });

      test.skip("to the wall but not beyond", () => {
        for (let _ = 0; _ < 2*BOARD_WIDTH; _++) {
          board.moveLeft();
        }

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

      test.skip("by one column", () => {
        expect(board.toString()).to.equalShape(
          `.....T....
           ....TTT...
           ..........
           ..........
           ..........
           ..........`
        );
      });

      test.skip("to the wall", () => {
        board.moveRight();
        board.moveRight();
        board.moveRight();
        expect(board.toString()).to.equalShape(
          `........T.
           .......TTT
           ..........
           ..........
           ..........
           ..........`
        );
      });

      test.skip("to the wall but not beyond", () => {
        for (let _ = 0; _ < 2*BOARD_WIDTH; _++) {
          board.moveRight();
        }
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

      test.skip("by one row", () => {
        expect(board.toString()).to.equalShape(
          `..........
           ....T.....
           ...TTT....
           ..........
           ..........
           ..........`
        );
      });

      test.skip("to floor", () => {
        board.moveDown();
        board.moveDown();
        board.moveDown();
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
          for (let _ = 0; _ < 3; _++) {
            board.moveDown();
          }
        })

        test.skip("it is still moving on the last row", () => {
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

        test.skip("it stops when it hits the floor", () => {
          board.moveDown();
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

        test.skip("it stays on the floor after stopping", () => {
          fallToBottom(board);
          expect(board.toString()).to.equalShape(
            `..........
             ..........
             ..........
             ..........
             ....T.....
             ...TTT....`
          );
        })
      });
    });
  });

});
