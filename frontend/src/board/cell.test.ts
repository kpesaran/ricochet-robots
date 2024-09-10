import { Cell } from './cell';
import { Wall } from './wall';

import { expect, test } from 'vitest';

test('Default cell holds expected values', () => {
  let default_cell = new Cell();
  expect(default_cell.walls.length).toBe(0);
  expect(default_cell.isObstructed).toBe(false);
  expect(default_cell.isTarget).toBe(false);
});

test('Adding wall updates walls correctly', () => {
  let cell = new Cell();
  cell.addWall(Wall.North);
  expect(cell.walls.length).toBe(1);
  expect(cell.walls).toStrictEqual([Wall.North]);
});

test('Adding walls twice works correctly', () => {
  let cell = new Cell();
  cell.addWall(Wall.North);
  cell.addWall(Wall.North);
  expect(cell.walls.length).toBe(1);
  expect(cell.walls).toStrictEqual([Wall.North]);
})

test('Removing walls works correctly', () => {
  let cell = new Cell();
  cell.addWall(Wall.North);
  expect(cell.walls.length).toBe(1);
  expect(cell.walls).toStrictEqual([Wall.North]);
  cell.removeWall(Wall.North);
  expect(cell.walls.length).toEqual(0);
})

test('Removing nonexistent wall is no-op', () => {
  let cell = new Cell();
  cell.addWall(Wall.North);
  expect(cell.walls.length).toBe(1);
  expect(cell.walls).toStrictEqual([Wall.North]);
  cell.removeWall(Wall.South);
  expect(cell.walls.length).toBe(1);
  expect(cell.walls).toStrictEqual([Wall.North]);
})
