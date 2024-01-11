import { RotatingShape } from "./RotatingShape.mjs"

export class Board {
  width;
  height;
  board;
  fallingState;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      this.board[i] = new Array(this.width).fill(".");
    }
    this.fallingState = null;
  }

  drop(shape) {
    if (this.fallingState != null) {
      throw new Error("already falling");
    }
    shape = (typeof shape === "string" || shape instanceof String) ? new RotatingShape(shape, 1) : shape; // Ugly hack => The given FallingBlocks test drops a string and I'm not sure if we are allowed to refactor it
    this.fallingState = {
      y: shape.height()-1,
      x: Math.floor(this.width/2) - Math.floor(shape.width()/2) - (this.width % 2 == 0 ? 1 : 0),
      shape
    };
    for (let dy = 0; dy < shape.height(); dy++) {
      for (let dx = 0; dx < shape.width(); dx++) {
        this.board[this.fallingState.y-(this.fallingState.shape.height()-1)+dy][this.fallingState.x+dx] = shape.symbolAt(dy, dx);
      }
    }
  }

  tick() {
    if (this.fallingState === null) {
      return;
    }
    const blockCoords = this.fallingShapeBlockCoords(this.fallingState);
    if (!this.inBoundsAndEmpty(blockCoords, 1, 0)) {
      this.fallingState = null;
      return;
    }
    this.fallingState = { ...this.fallingState, y: this.fallingState.y+1 };
    for (const pos of blockCoords) {
      this.board[pos.y+1][pos.x] = this.board[pos.y][pos.x];
      this.board[pos.y][pos.x] = ".";
    }
  }

  inBoundsAndEmpty(coords, dy, dx) {
    const boardCopy = this.board.map(row => row.slice());
    for (const pos of coords) {
      if (!this.inBounds(pos.y+dy, pos.x+dx)) {
        return false;
      }
      boardCopy[pos.y][pos.x] = null; // Mark prev position to distinct it from other tetrominoes
    }
    for (const pos of coords) {
      if (boardCopy[pos.y+dy][pos.x+dx] != null && boardCopy[pos.y+dy][pos.x+dx] != ".") {
        return false;
      }
    }
    return true;
  }

  inBounds(y, x) {
    return y >= 0 && y < this.board.length && x >= 0 && x < this.board[y].length;
  }

  fallingShapeBlockCoords(fallingStateObj) {
    // NOTE: Passes all current tests, but will probably cause problems later
    // =>    Scanning a rectangular region that might contain other tetrominoes
    const blockCoords = []
    for (let dy = (fallingStateObj.shape.height()-1); dy >= 0; dy--) { // Iterate starting from bottom row
      for (let dx = 0; dx < fallingStateObj.shape.width(); dx++) {
        if (fallingStateObj.shape.symbolAt(dy, dx) == ".") {
          continue;
        }
        blockCoords.push({ y: fallingStateObj.y-(fallingStateObj.shape.height()-1)+dy, x: fallingStateObj.x+dx });
      }
    }
    return blockCoords;
  }

  hasFalling() {
    return this.fallingState != null;
  }

  toString() {
    return this.board.map(row => row.join("")).join("\n") + '\n';
  }
}
