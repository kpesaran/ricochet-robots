import { Board, BOARD_SIZE } from './board';

import { expect, test } from 'vitest';
import { Direction } from './direction';

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
  expect(board.checkDirections({ row: 6, column: 15 }, Direction.North)).toStrictEqual(
    { row: 0, column: 15 }
  );
});

test('Checking eligible moves in the South direction', () => {
  let board = new Board();
  expect(board.checkDirections({ row: 6, column: 15 }, Direction.South)).toStrictEqual(
    { row: 15, column: 15 }
  );
});

test('Checking eligible moves in the East direction', () => {
  let board = new Board();
  expect(board.checkDirections({ row: 6, column: 14 }, Direction.East)).toStrictEqual(
    { row: 6, column: 15 }
  );
});

test('Checking eligible move in the West direction', () => {
  let board = new Board();
  expect(board.checkDirections({ row: 6, column: 15 }, Direction.West)).toStrictEqual(
    { row: 6, column: 0 }
  );
});

test("Should return target cell in path", () => {
  let board = new Board();
  if (board.cells[15] && board.cells[15][14]) {
    board.cells[15][14].isTarget = true;
  }
  expect(board.checkDirections({ row: 9, column: 14 }, Direction.South)).toStrictEqual({ row: 15, column: 14 });
  expect(board.checkDirections({ row: 15, column: 9 }, Direction.East)).toStrictEqual({ row: 15, column: 14 });
});

test("Checking eligible move position if another robot is in the path", () => {
  let board = new Board();
  board.robotPositions = [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 11, column: 0 },
    { row: 0, column: 3 },
  ];
  expect(board.checkDirections({ row: 0, column: 0 }, Direction.East)).toStrictEqual(null);
  expect(board.checkDirections({ row: 0, column: 0 }, Direction.South)).toStrictEqual({ row: 10, column: 0 });
});

test("Checking eligibleMove method does not return an isObstructed cell position", () => {
  let board = new Board();
  // from South
  expect(board.checkDirections({ row: 0, column: 8 }, Direction.South)).toStrictEqual({ row: 6, column: 8 });
  expect(board.checkDirections({ row: 3, column: 7 }, Direction.South)).toStrictEqual({ row: 6, column: 7 });
  // from North
  expect(board.checkDirections({ row: 15, column: 7 }, Direction.North)).toStrictEqual({ row: 9, column: 7 });
  expect(board.checkDirections({ row: 15, column: 8 }, Direction.North)).toStrictEqual({ row: 9, column: 8 });
  // from East
  expect(board.checkDirections({ row: 7, column: 0 }, Direction.East)).toStrictEqual({ row: 7, column: 6 });
  expect(board.checkDirections({ row: 8, column: 4 }, Direction.East)).toStrictEqual({ row: 8, column: 6 });
  // from West
  expect(board.checkDirections({ row: 7, column: 10 }, Direction.West)).toStrictEqual({ row: 7, column: 9 });
  expect(board.checkDirections({ row: 8, column: 13 }, Direction.West)).toStrictEqual({ row: 8, column: 9 });
});

test("Checking eligibleMove method handles walls correctly", () => {
  let board = new Board();
  board.cells[1]?.[1]?.addWall(Direction.West);
  board.cells[1]?.[1]?.addWall(Direction.South);
  board.cells[1]?.[0]?.addWall(Direction.East);
  board.cells[2]?.[1]?.addWall(Direction.North);
  // if robot already at a cell with a wall
  expect(board.checkDirections({ row: 2, column: 1 }, Direction.North)).toStrictEqual(null);
  expect(board.checkDirections({ row: 1, column: 0 }, Direction.East)).toStrictEqual(null);
  expect(board.checkDirections({ row: 1, column: 1 }, Direction.West)).toStrictEqual(null);
  expect(board.checkDirections({ row: 1, column: 1 }, Direction.South)).toStrictEqual(null);
  expect(board.checkDirections({ row: 1, column: 1 }, Direction.East)).toStrictEqual({ row: 1, column: 15 });

  expect(board.checkDirections({ row: 5, column: 1 }, Direction.North)).toStrictEqual({ row: 2, column: 1 });
  expect(board.checkDirections({ row: 1, column: 2 }, Direction.West)).toStrictEqual({ row: 1, column: 1 });
  expect(board.checkDirections({ row: 1, column: 8 }, Direction.West)).toStrictEqual({ row: 1, column: 1 });
  expect(board.checkDirections({ row: 0, column: 1 }, Direction.South)).toStrictEqual({ row: 1, column: 1 });
});
