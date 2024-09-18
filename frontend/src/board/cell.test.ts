import { Cell } from './cell';
import { Direction } from './direction';

import { expect, test } from 'vitest';

test('Default cell holds expected values', () => {
  let default_cell = new Cell();
  expect(default_cell.walls.length).toBe(0);
  expect(default_cell.isObstructed).toBe(false);
  expect(default_cell.isTarget).toBe(false);
});

test('Adding wall updates walls correctly', () => {
  let cell = new Cell();
  cell.addWall(Direction.North);
  expect(cell.walls.length).toBe(1);
  expect(cell.walls).toStrictEqual([Direction.North]);
});

test('Adding walls twice works correctly', () => {
  let cell = new Cell();
  cell.addWall(Direction.North);
  cell.addWall(Direction.North);
  expect(cell.walls.length).toBe(1);
  expect(cell.walls).toStrictEqual([Direction.North]);
})

test('Removing walls works correctly', () => {
  let cell = new Cell();
  cell.addWall(Direction.North);
  expect(cell.walls.length).toBe(1);
  expect(cell.walls).toStrictEqual([Direction.North]);
  cell.removeWall(Direction.North);
  expect(cell.walls.length).toEqual(0);
})

test('Removing nonexistent wall is no-op', () => {
  let cell = new Cell();
  cell.addWall(Direction.North);
  expect(cell.walls.length).toBe(1);
  expect(cell.walls).toStrictEqual([Direction.North]);
  cell.removeWall(Direction.South);
  expect(cell.walls.length).toBe(1);
  expect(cell.walls).toStrictEqual([Direction.North]);
})
