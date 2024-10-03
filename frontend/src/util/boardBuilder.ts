import { Board } from '../board/board';
import { Robot } from '../board/robot';
import { Cell } from '../board/cell';
import { Direction } from '../board/direction';
 import type { Position } from '../board/position';


export class BoardBuilder {
  robots: [Robot, Position][];
  walls: [Direction, Position][];
  targetCell: Position | null

  constructor() {
    this.robots = []
    this.walls = []
    this.targetCell = null
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

  public withWall(newWall: Direction, newPosition: Position): BoardBuilder {
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
        case Direction.North:
          board.cells[row - 1]?.[column]?.addWall(Direction.South);
          break;
        case Direction.South:
          board.cells[row + 1]?.[column]?.addWall(Direction.North);
          break;
        case Direction.East:
          board.cells[row]?.[column + 1]?.addWall(Direction.West);
          break;
        case Direction.West:
          board.cells[row]?.[column - 1]?.addWall(Direction.East);
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
  
  public withTargetCell(newPosition: Position) {
    this.targetCell = newPosition
    return this
  }

  private addTargetCell(board: Board) {
    if (this.targetCell) {
      board.cells[this.targetCell.row]![this.targetCell.column]!.isTarget = true 
    }
  }

  public build() {
    let board = new Board();

    this.addWalls(board);
    this.addRobots(board);
    this.addTargetCell(board)

    return board;
  }
}
