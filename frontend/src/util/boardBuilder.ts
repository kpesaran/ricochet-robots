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
  generatePairedWalls() {
    // NW quadrant
    this.withWall(Direction.West, {row: 3, column: 1})
    this.withWall(Direction.South, { row: 3, column: 1 })
    this.withWall(Direction.East, { row: 6, column: 3 })
    this.withWall(Direction.South, { row: 6, column: 3 })
    this.withWall(Direction.North, { row: 4, column: 6 })
    this.withWall(Direction.East, { row: 4, column: 6 })

    // NE quadrant
    this.withWall(Direction.West, {row: 2, column: 11})
    this.withWall(Direction.South, { row: 2, column: 11 })
    this.withWall(Direction.East, { row: 6, column: 14 })
    this.withWall(Direction.South, { row: 6, column: 14 })
    this.withWall(Direction.North, { row: 6, column: 8 })
    this.withWall(Direction.West, { row: 6, column: 8 })

    // SE quadrant
    this.withWall(Direction.East, {row: 12, column: 11})
    this.withWall(Direction.South, { row: 12, column: 11 })
    this.withWall(Direction.West, { row: 10, column: 9 })
    this.withWall(Direction.North, { row: 10, column: 9 })
    this.withWall(Direction.North, { row: 14, column: 14 })
    this.withWall(Direction.East, { row: 14, column: 14 })


    // SW quadrant
    this.withWall(Direction.West, {row: 8, column: 1})
    this.withWall(Direction.South, { row: 8, column: 1 })
    this.withWall(Direction.East, { row: 12, column: 4 })
    this.withWall(Direction.North, { row: 12, column: 4 })
    this.withWall(Direction.South, { row: 15, column: 2 })
    this.withWall(Direction.East, { row: 15, column: 2 })

    // 

  }




  public build() {
    let board = new Board();
    this.generateEdgeWalls()
    this.generatePairedWalls()
    this.addWalls(board);
    this.addRobots(board);

    return board;
  }
}
