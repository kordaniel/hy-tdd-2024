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
      x: Math.floor(this.width/2) - Math.floor(shape.width()/2),
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
    const newCoords = { ...this.fallingCoords, y: this.fallingCoords.y+1 };
    if (newCoords.y === this.height) {
      this.fallingCoords = null;
      return;
    } else if (this.board[newCoords.y][newCoords.x] != ".") {
      this.fallingCoords = null;
      return;
    }

    for (let dy = 0; dy < newCoords.shape.height(); dy++) {
      for (let dx = 0; dx < newCoords.shape.width(); dx++) { this.board[newCoords.y-dy][newCoords.x+dx] = this.board[newCoords.y-dy-1][newCoords.x+dx]; this.board[newCoords.y-dy-1][newCoords.x + dx] = "."; }
    }

    this.fallingCoords = newCoords;
  }

  hasFalling() {
    return this.fallingCoords != null;
  }

  toString() {
    return this.board.map(row => row.join("")).join("\n") + '\n';
  }
}
