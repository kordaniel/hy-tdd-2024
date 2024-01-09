export class Board {
  width;
  height;
  board;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      this.board[i] = new Array(this.width).fill(".");
    }
  }

  drop(shape) {
    this.board[0][Math.floor(this.width / 2)] = shape;
  }

  toString() {
    return this.board.map(row => row.join("")).join("\n") + '\n';
  }
}
