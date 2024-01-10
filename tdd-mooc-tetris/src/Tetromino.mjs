import { RotatingShape } from "./RotatingShape.mjs"

export class Tetromino {

  static I_SHAPE = new RotatingShape(".....\n.....\nIIII.\n.....\n.....", 2);
  static O_SHAPE = new RotatingShape(".OO\n.OO\n...", 1)
  static T_SHAPE = new RotatingShape(".T.\nTTT\n...", 4);

}
