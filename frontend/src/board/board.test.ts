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


test('Checking eligible moves in the North direction', () => {
  let board = new Board();
  expect(board.checkDirections(6, 15, 'North')).toStrictEqual(
    { row: 0, column: 15 })
}
)
test('Checking eligible moves in the South direction', () => {
  let board = new Board();
  expect(board.checkDirections(6, 15, 'South')).toStrictEqual(
    { row: 15, column: 15 })
}
)

test('Checking eligible moves in the East direction', () => {
  let board = new Board();
  expect(board.checkDirections(6, 14, 'East')).toStrictEqual(
    {row: 6, column: 15})
}
)
test('Checking eligible move in the West direction', () => {
  let board = new Board();
  expect(board.checkDirections(6, 15, 'West')).toStrictEqual(
  {row: 6, column: 0})
}
)

test("Should return target cell in path", () => {
  let board = new Board();
  if (board.cells[15] && board.cells[15][15]) {
    board.cells[15][15].isObstructed = true;
  }
  expect(board.checkDirections(9,15,"South")).toStrictEqual({row:15,column:15})
  expect(board.checkDirections(15,9,"East")).toStrictEqual({row:15,column:15})
})

test("Checking eligible move position if another robot is in the path", () => {
  let board = new Board();
  board.robotPositions = [
    { row: 0, column: 0},
    { row: 0, column: 1},
    { row: 11, column: 0},
    { row: 0, column: 3},
  ];
  expect(board.checkDirections(0, 0, 'East')).toStrictEqual(null)
  expect(board.checkDirections(0, 0, 'South')).toStrictEqual({ row: 10, column: 0 })
})





