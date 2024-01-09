export class RotatingShape {

  constructor(shape) {
    this.shape = shape.split("\n").map(l => l.trim().split(""));
  }

  rotateRight() {
    return new RotatingShape(
      this.shape[0]
        .map((_, i) => this.shape.map(row => row[i]).reverse())
        .map(row => row.join(""))
        .join("\n")
    );
  }

  toString() {
    return this.shape.map(row => row.join("")).join("\n") + "\n";
  }
}
