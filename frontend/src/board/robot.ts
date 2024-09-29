import { Color } from './color';

export class Robot {
  isTarget: boolean;
  color: Color;

  constructor(color: Color) {
    this.isTarget = false;
    this.color = color;
  }
}
