import { Board } from '../board/board';
import { Robot } from '../board/robot';
import { Wall } from '../board/wall';
 
import type { Position } from '../board/position';

export class BoardBuilder {
  robots: [Robot, Position][];
  walls: [Wall, Position][];

  constructor() {
    this.robots = []
    this.walls = []
  }

  public withRobot(newRobot: Robot, newPosition: Position): BoardBuilder {
    let robotPosition = this.robots.find(
      ([oldRobot, _position]) => oldRobot.color === newRobot.color
    );

    if (robotPosition !== undefined) {
      robotPosition[1] = newPosition;
    } else {
      this.robots.push([newRobot, newPosition]);
    }
    return this;
  }

  public withWall(newWall: Wall, newPosition: Position): BoardBuilder {
    let wallPosition = this.walls.find(
      ([oldWall, oldPosition]) => oldWall === newWall &&  oldPosition === newPosition,
    );

    if (wallPosition === undefined) {
      this.walls.push([newWall, newPosition]);
    }

    return this;
  }

  private addWalls(board: Board) {
    for (let [wall, { row, column }] of this.walls) {
      board.cells[row]?.[column]?.addWall(wall);

      switch(wall) {
        case Wall.North:
          board.cells[row - 1]?.[column]?.addWall(Wall.South);
          break;
        case Wall.South:
          board.cells[row + 1]?.[column]?.addWall(Wall.North);
          break;
        case Wall.East:
          board.cells[row]?.[column + 1]?.addWall(Wall.West);
          break;
        case Wall.West:
          board.cells[row]?.[column - 1]?.addWall(Wall.East);
          break;
      }
    }
  }

  private addRobots(board: Board) {
    for (let [robot, position] of this.robots) {
      let botIndex = board.robots.findIndex(bot => bot.color === robot.color);
      board.robotPositions[botIndex] = position;
    }
  }

  public build() {
    let board = new Board();

    this.addWalls(board);
    this.addRobots(board);

    return board;
  }
}
