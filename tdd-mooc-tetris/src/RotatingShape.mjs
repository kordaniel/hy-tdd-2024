export class RotatingShape {

  constructor(shape, rotations = 4, rotation = 0) {
    this.shape = Array.isArray(shape) ? shape : shape.split("\n").map(l => l.trim().split(""));
    this.rotations = rotations;
    this.rotation = rotation;
  }

  rotateRight() {
    return new RotatingShape(
      this.shape[0].map((_, i) => this.shape.map(row => row[i]).reverse()),
      this.rotations,
      this.rotation + 1 % this.rotations
    );
  }

  rotateLeft() {
    if (this.rotation > 0) {
      return new RotatingShape(
        this.shape[0].map((_, i) => this.shape.map(row => row[row.length - 1 - i])),
          this.rotations,
          this.rotation - 1
        );
    }
    return Array.from(Array(this.rotations-1)).reduce((acc, _) => acc.rotateRight(), this);
  }

  toString() {
    return this.shape.map(row => row.join("")).join("\n") + "\n";
  }
}
