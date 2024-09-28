import { Board } from '../board/board';
import { Robot } from '../board/robot';
import { Direction } from '../board/direction';
 
import type { Position } from '../board/position';

export class BoardBuilder {
  robots: [Robot, Position][];
  walls: [Direction, Position][];
    static build: any;

  constructor() {
    this.robots = []
    // come back and check north with row 0
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
 
  generateEdgeWalls(){
    //edge pieces
    
    // NW quadrant
    this.withWall(Direction.East, { row: 0, column: 5 }) 
    this.withWall(Direction.South, { row: 5, column: 0 }) 

    // NE quadrant
    this.withWall(Direction.East, { row: 0, column: 10 }) 
    this.withWall(Direction.South, { row: 3, column: 15 }) 

    // SE quadrant
    this.withWall(Direction.East, { row: 15, column: 10 })
    this.withWall(Direction.South, { row: 8, column: 15 }) 

    //SW quadrant
    this.withWall(Direction.South, { row: 10, column: 0 }) 
    this.withWall(Direction.East, { row: 15, column: 4 })

  }


  public build() {
    let board = new Board();
    this.generateEdgeWalls()
    this.addWalls(board);
    this.addRobots(board);

    return board;
  }
}
