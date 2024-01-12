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
    if (this.hasFalling()) {
      throw new Error("already falling");
    }
    shape = (typeof shape === "string" || shape instanceof String) ? new RotatingShape(shape, 1) : shape; // Ugly hack => The given FallingBlocks test drops a string and I'm not sure if we are allowed to refactor it
    this.fallingState = {
      y: shape.height()-1,
      x: Math.floor(this.width/2) - Math.floor(shape.width()/2) - (this.width % 2 == 0 ? 1 : 0),
      shape
    };

    for (const pos of this.fallingState.shape.getCoords()) {
      if (!this.isEmpty(pos.y, this.fallingState.x + pos.x)) {
        this.fallingState = null;
        return;
      }
    }

    for (const pos of this.fallingState.shape.getCoords()) {
      this.board[pos.y][this.fallingState.x + pos.x] = shape.symbolAt(pos.y, pos.x);
    }
  }

  tick() {
    if (!this.hasFalling()) {
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

  moveDown() {
    if (!this.hasFalling) {
      return;
    }
    const positionChanged = this.moveFalling(1, 0, (a, b) => a.y == b.y ? a.x-b.x : b.y-a.y);
    if (!positionChanged) {
      this.fallingState = null;
    }
  }

  moveLeft() {
    if (!this.hasFalling()) {
      return;
    }
    this.moveFalling(0, -1, (a, b) => a.x == b.x ? a.y-b.y : a.x-b.x);
  }

  moveRight() {
    if (!this.hasFalling()) {
      return;
    }
    this.moveFalling(0, 1, (a, b) => a.x == b.x ? a.y-b.y : b.x-a.x);
  }

  moveFalling(dy, dx, sortByCb) {
    const topY = this.fallingState.y - (this.fallingState.shape.height() - 1);
    const leftX = this.fallingState.x;
    const blockCoords = this.fallingState.shape.getCoords()
      .map(pos => ({ y: topY + pos.y, x: leftX + pos.x }))
      .sort(sortByCb);

    if (!this.inBoundsAndEmpty(blockCoords, dy, dx)) {
      return false;
    }
    this.fallingState = { ...this.fallingState, y: this.fallingState.y+dy, x: this.fallingState.x+dx };
    for (const pos of blockCoords) {
      this.board[pos.y+dy][pos.x+dx] = this.board[pos.y][pos.x];
      this.board[pos.y][pos.x] = ".";
    }
    return true;
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

  isEmpty(y, x) {
    return this.board[y][x] == ".";
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
