import { Board } from '../board/board';
import { Robot } from '../board/robot';
import { Direction } from '../board/direction';
 
import type { Position } from '../board/position';
import { BOARD_SIZE } from '../board/board';

export class BoardBuilder {
  robots: [Robot, Position][];
  walls: [Direction, Position][];

  constructor() {
    this.robots = []
    this.walls = []
    this.generateRandomPairedWalls()
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

  public generateRandomPairedWalls() {
    const wallsNorthSouth = [Direction.North, Direction.South]
    const wallsEastWest = [Direction.West, Direction.East]

    // NW
    this.placePairWallsInQuadrant(wallsNorthSouth, wallsEastWest, 1,  BOARD_SIZE / 2 - 1, 1, BOARD_SIZE / 2 - 1)
    // SW
    this.placePairWallsInQuadrant(wallsNorthSouth, wallsEastWest, BOARD_SIZE / 2, BOARD_SIZE - 2, 1, BOARD_SIZE / 2 - 1)
    // NE
    this.placePairWallsInQuadrant(wallsNorthSouth, wallsEastWest, 1, BOARD_SIZE / 2 - 1, BOARD_SIZE / 2, BOARD_SIZE - 2)
    // SE
    this.placePairWallsInQuadrant(wallsNorthSouth,wallsEastWest, BOARD_SIZE / 2, BOARD_SIZE - 2, BOARD_SIZE / 2, BOARD_SIZE - 2)
    console.log(this.walls)
    return this
  }

  private placePairWallsInQuadrant(wallsNS: Direction[], wallsEW: Direction[], rowStart: number, colStart: number, rowEnd: number, colEnd: number) {
    {
      for (let i = 0; i < 3; i++) {
        const randomRow = this.getRandomInt(rowStart, rowEnd );
        const randomCol = this.getRandomInt(colStart, colEnd);
        const randomIdx1 = Math.floor(Math.random() * wallsNS.length);
        const randomIdx2 = Math.floor(Math.random() * wallsEW.length);
    
        this.withWall(wallsNS[randomIdx1]!,{ row: randomRow, column: randomCol }).withWall(wallsEW[randomIdx2]!, { row: randomRow, column: randomCol });
      }
    }
  }

  private getRandomInt(min: number, max: number):number {
    return Math.floor(Math.random() * (max - min + 1) + min)
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

  public build() {
    let board = new Board();
    this.addWalls(board);
    this.addRobots(board);

    return board;
  }
}
