import { RotatingShape } from "./RotatingShape.mjs"

export class Board {
  width;
  height;
  board;
  fallingCoords;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      this.board[i] = new Array(this.width).fill(".");
    }
    this.fallingCoords = null;
  }

  drop(shape) {
    if (this.fallingCoords != null) {
      throw new Error("already falling");
    }
    shape = (typeof shape === "string" || shape instanceof String) ? new RotatingShape(shape, 1) : shape; // Ugly hack => The given FallingBlocks test drops a string and I'm not sure if we are allowed to refactor it
    this.fallingCoords = {
      y: shape.height()-1,
      x: Math.floor(this.width/2) - Math.floor(shape.width()/2) - (this.width % 2 == 0 ? 1 : 0),
      shape
    };
    for (let dy = 0; dy < shape.height(); dy++) {
      for (let dx = 0; dx < shape.width(); dx++) {
        this.board[this.fallingCoords.y-(this.fallingCoords.shape.height()-1)+dy][this.fallingCoords.x+dx] = shape.symbolAt(dy, dx);
      }
    }
  }

  tick() {
    if (this.fallingCoords === null) {
      return;
    }
    const blockCoords = this.fallingShapeBlockCoords(this.fallingCoords);
    if (!this.inBoundsAndEmpty(blockCoords, 1, 0)) {
      this.fallingCoords = null;
      return;
    }
    this.fallingCoords = { ...this.fallingCoords, y: this.fallingCoords.y+1 };
    for (const pos of blockCoords) {
      this.board[pos.y+1][pos.x] = this.board[pos.y][pos.x];
      this.board[pos.y][pos.x] = ".";
    }
  }

  inBoundsAndEmpty(coords, dy, dx) {
    const boardCopy = this.board.map(row => row.slice());
    for (const pos of coords) {
      if (pos.y+dy < 0 || pos.y+dy >= this.board.length || pos.x+dx < 0 || pos.x+dx >= this.board[pos.y+dy].length) {
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

  fallingShapeBlockCoords(fallingCoords) {
    // NOTE: Passes all current tests, but will probably cause problems later
    // =>    Scanning a rectangluar region that might contain other tetrominoes
    const blockCoords = []
    for (let dy = (fallingCoords.shape.height()-1); dy >= 0; dy--) { // Iterate starting from bottom row
      for (let dx = 0; dx < fallingCoords.shape.width(); dx++) {
        if (fallingCoords.shape.symbolAt(dy, dx) == ".") {
          continue;
        }
        blockCoords.push({ y: fallingCoords.y-(fallingCoords.shape.height()-1)+dy, x: fallingCoords.x+dx });
      }
    }
    return blockCoords;
  }

  hasFalling() {
    return this.fallingCoords != null;
  }

  toString() {
    return this.board.map(row => row.join("")).join("\n") + '\n';
  }
}
