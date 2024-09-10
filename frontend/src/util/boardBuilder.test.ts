import { test, expect } from 'vitest'
import { BoardBuilder } from './boardBuilder'
import { Board } from '../board/board';
import { Color } from '../board/color';
import { Robot } from '../board/robot';
import { Wall } from '../board/wall';

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
      .withWall(Wall.North,{ row: 1, column: 0 })
      .withWall(Wall.East, { row: 1, column: 0 })
      .build();

    expect(board.cells[1]?.[0]?.walls).toStrictEqual([Wall.North, Wall.East]);
    expect(board.cells[0]?.[0]?.walls).toStrictEqual([Wall.South]);
    expect(board.cells[1]?.[1]?.walls).toStrictEqual([Wall.West]);
  }
)

test(
  "Builder doesn't crash when border walls are added",
  () => {
    let board = new BoardBuilder()
      .withWall(Wall.North, { row: 0, column: 0 })
      .withWall(Wall.West, { row: 0, column: 0 })
      .withWall(Wall.East, { row: 15, column: 15 })
      .withWall(Wall.South, { row: 15, column: 15 })
      .build();

    expect(board.cells[0]?.[0]?.walls).toStrictEqual([Wall.North, Wall.West]);
    expect(board.cells[15]?.[15]?.walls).toStrictEqual([Wall.East, Wall.South]);
  }
)
