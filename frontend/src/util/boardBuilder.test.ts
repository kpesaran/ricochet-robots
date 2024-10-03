import { test, expect } from 'vitest'
import { BoardBuilder } from './boardBuilder'
import { Board } from '../board/board';
import { Color } from '../board/color';
import { Robot } from '../board/robot';
import { Direction } from '../board/direction';

test(
  'Empty builder returns default board',
  () => {
    let actual = new BoardBuilder().build();
    let expected = new Board();
    expect(actual).toStrictEqual(expected);
  }
)

test(
  'Builder moves robots appropriately',
  () => {
    let board = new BoardBuilder()
      .withRobot(new Robot(Color.Green), { row: 10, column: 10})
      .withRobot(new Robot(Color.Red), {row: 15, column: 15})
      .build();

    let greenBot = board.robots.findIndex(bot => bot.color == Color.Green);

    expect(board.robotPositions[greenBot]).toStrictEqual({ row: 10, column: 10});

    let redBot = board.robots.findIndex(bot => bot.color == Color.Red);
    expect(board.robotPositions[redBot]).toStrictEqual({ row: 15, column: 15});
  }
)

test(
  'Builder adds walls appropriately',
  () => {
    let board = new BoardBuilder()
      .withWall(Direction.North,{ row: 1, column: 0 })
      .withWall(Direction.East, { row: 1, column: 0 })
      .build();

    expect(board.cells[1]?.[0]?.walls).toStrictEqual([Direction.North, Direction.East]);
    expect(board.cells[0]?.[0]?.walls).toStrictEqual([Direction.South]);
    expect(board.cells[1]?.[1]?.walls).toStrictEqual([Direction.West]);
  }
)

test(
  "Builder doesn't crash when border walls are added",
  () => {
    let board = new BoardBuilder()
      .withWall(Direction.North, { row: 0, column: 0 })
      .withWall(Direction.West, { row: 0, column: 0 })
      .withWall(Direction.East, { row: 15, column: 15 })
      .withWall(Direction.South, { row: 15, column: 15 })
      .build();

    expect(board.cells[0]?.[0]?.walls).toStrictEqual([Direction.North, Direction.West]);
    expect(board.cells[15]?.[15]?.walls).toStrictEqual([Direction.East, Direction.South]);
  }
)


test("Builder adds targetCell appropriately", () => {
  let board = new BoardBuilder()
    .withTargetCell({ row: 5, column: 5 })
    .build()
  
  expect(board.cells[5]?.[5]?.isTarget).toStrictEqual(true)
})

test('returns the original and adacent wall position for a given direction', () => {
  let board = new BoardBuilder()
  const northDirection = board.wallPositionsToCheck(Direction.North, { row: 2, column: 3 });
  expect(northDirection).toEqual([
    [Direction.North, { row: 2, column: 3 }],
    [Direction.South, { row: 1, column: 3 }]
  ]);


  const southDirection = board.wallPositionsToCheck(Direction.South, { row: 2, column: 3 });
  expect(southDirection).toEqual([
    [Direction.South, { row: 2, column: 3 }],
    [Direction.North, { row: 3, column: 3 }]
  ]);

  const eastDirection = board.wallPositionsToCheck(Direction.East, { row: 2, column: 3 });
  expect(eastDirection).toEqual([
    [Direction.East, { row: 2, column: 3 }],
    [Direction.West, { row: 2, column: 4 }]
  ]);

  const westDirection = board.wallPositionsToCheck(Direction.West, { row: 2, column: 3 });
  expect(westDirection).toEqual([
    [Direction.West, { row: 2, column: 3 }],
    [Direction.East, { row: 2, column: 2 }]
  ]);
});

test('correctly identifies duplicate walls', () => {
  let board = new BoardBuilder()

  board.walls =  [
    [Direction.North, { row: 3, column: 3 }],
    [Direction.West, { row: 5, column: 5 }]
  ];
  
  const wallsToCheck = board.wallPositionsToCheck(Direction.North, { row: 3, column: 3 });
  const isDuplicate = board.duplicateWall(wallsToCheck);
  expect(isDuplicate).toBe(true);

  const downCellsouthWall = board.wallPositionsToCheck(Direction.South, { row: 2, column: 3 });
  const correspondingSouthWallCheck = board.duplicateWall(downCellsouthWall)
  expect(correspondingSouthWallCheck).toStrictEqual(true)

  const leftCellEastWall = board.wallPositionsToCheck(Direction.East, { row: 5, column: 4 })
  const correspondingEastWallCheck = board.duplicateWall(leftCellEastWall)
  expect(correspondingEastWallCheck).toBe(true)
  
  const nonDuplicateWallsToCheck = board.wallPositionsToCheck(Direction.South, { row: 4, column: 4 });
  const nonDuplicate = board.duplicateWall(nonDuplicateWallsToCheck);
  expect(nonDuplicate).toBe(false);
});
