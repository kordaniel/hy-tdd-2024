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
    this.fallingCoords = { y: 0, x: Math.floor(this.width / 2) }
    this.board[this.fallingCoords.y][this.fallingCoords.x] = shape;
  }

  tick() {
    const newCoords = { ...this.fallingCoords, y: this.fallingCoords.y + 1 };
    this.board[newCoords.y][newCoords.x] = this.board[this.fallingCoords.y][this.fallingCoords.x];
    this.board[this.fallingCoords.y][this.fallingCoords.x] = ".";
    this.fallingCoords = newCoords;
  }

  hasFalling() {
    return this.fallingCoords != null;
  }

  toString() {
    return this.board.map(row => row.join("")).join("\n") + '\n';
  }
}
