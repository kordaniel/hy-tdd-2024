export class RotatingShape {

  constructor(shape) {
    this.shape = shape.split('\n').map(l => l.trim().split());
  }

  toString() {
    return this.shape.map(row => row.join("")).join("\n") + "\n";
  }
}
