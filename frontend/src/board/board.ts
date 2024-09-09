import { Cell } from './cell';
import { Color } from './color';
import { Robot } from './robot';
import type { Position } from './position';

/*
 * The height and width of the board
 */
export const BOARD_SIZE = 16;

export class Board {
  cells: Cell[][] ;
  robots: [Robot, Robot, Robot, Robot];
  robotPositions: [Position, Position, Position, Position];

  constructor() {
    let cells = new Array(BOARD_SIZE)

    for (let r = 0; r < BOARD_SIZE; r++) {
      let row = new Array(BOARD_SIZE);
      for (let c = 0; c < BOARD_SIZE; c++) {
        row[c] = new Cell();
      }
      cells[r] = row
    }

    // The cells in the center of the board
    // are always obstructed
    cells[7][7].isObstructed = true;
    cells[7][8].isObstructed = true;
    cells[8][7].isObstructed = true;
    cells[8][8].isObstructed = true;

    this.cells = cells;
    this.robots = [
      new Robot(Color.Red),
      new Robot(Color.Yellow),
      new Robot(Color.Green),
      new Robot(Color.Blue),
    ];

    this.robotPositions = [
      { row: 0, column: 0},
      { row: 0, column: 1},
      { row: 0, column: 2},
      { row: 0, column: 3},
    ];
  }
}
