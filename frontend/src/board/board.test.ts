import { Board, BOARD_SIZE } from './board';

import { expect, test } from 'vitest';

test(
  'Board is constructed with a 16x16 array of wall-less cells',
  () => {
    let board = new Board();
    for (let row of board.cells) {
      for (let cell of row) {
        expect(cell.walls.length).toBe(0);
      }
    }
  },
);

test(
  'Board is constructed with center cells obstructed',
  () => {
    let board = new Board();

    let center_cells = [7, 8];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (center_cells.includes(row) && center_cells.includes(col)) {
          expect(board.cells[row]?.[col]?.isObstructed).toBe(true);
        } else {
          expect(board.cells[row]?.[col]?.isObstructed).toBe(false);
        }
      }
    }
  },
);

test(
  'Board is constructed with four robots on the top row',
  () => {
    let board = new Board();
    expect(board.robots.length).toBe(4);
    expect(board.robotPositions).toStrictEqual([
      {row: 0, column: 0},
      {row: 0, column: 1},
      {row: 0, column: 2},
      {row: 0, column: 3},
    ])
  },
);
