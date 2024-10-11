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
    
    // NW
    this.placePairWallsInQuadrant(1,  BOARD_SIZE / 2 - 1, 1, BOARD_SIZE / 2 - 1)
    // SW
    this.placePairWallsInQuadrant( BOARD_SIZE / 2, BOARD_SIZE - 2, 1, BOARD_SIZE / 2 - 1)
    // NE
    this.placePairWallsInQuadrant( 1, BOARD_SIZE / 2 - 1, BOARD_SIZE / 2, BOARD_SIZE - 2)
    // SE
    this.placePairWallsInQuadrant(BOARD_SIZE / 2, BOARD_SIZE - 2, BOARD_SIZE / 2, BOARD_SIZE - 2)

    return this
  }

  generateRandomEdgeWalls() {

    this.placeEdgeWallsNS(0, BOARD_SIZE / 2 - 2, 0)
    this.placeEdgeWallsNS(0, BOARD_SIZE / 2 - 2, BOARD_SIZE -1 ) 
    this.placeEdgeWallsNS(BOARD_SIZE/2, BOARD_SIZE - 2, 0)
    this.placeEdgeWallsNS(BOARD_SIZE/2, BOARD_SIZE - 2,BOARD_SIZE -1) 

    this.placeEdgeWallsEW(0, BOARD_SIZE / 2 - 2, 0)
    this.placeEdgeWallsEW(0, BOARD_SIZE / 2 - 2, BOARD_SIZE -1)
    this.placeEdgeWallsEW(BOARD_SIZE / 2, BOARD_SIZE - 2, 0)
    this.placeEdgeWallsEW(BOARD_SIZE / 2, BOARD_SIZE - 2, BOARD_SIZE -1)

  }

  private placeEdgeWallsEW(rowStart: number, rowEnd: number, column: number) {
    
    while (true) {
      const randomRow = this.getRandomInt(rowStart, rowEnd);
      const collisionsToCheck = this.wallPositionsToCheck(Direction.South, { row: randomRow, column })
      
      if (!this.duplicateWall(collisionsToCheck)) {
        this.withWall(Direction.South, { row: randomRow, column })
        break
      }
    }
  }
  private placeEdgeWallsNS(colStart: number, colEnd: number, row: number) {
    while (true) {

      const randomCol = this.getRandomInt(colStart, colEnd);
      const collisionsToCheck = this.wallPositionsToCheck(Direction.South, { row, column: randomCol,  })
      
      if (!this.duplicateWall(collisionsToCheck)) {
        this.withWall(Direction.East, { row, column: randomCol })
        break
      }

    }
  }

  private placePairWallsInQuadrant( rowStart: number, colStart: number, rowEnd: number, colEnd: number) {
    {
      const wallsNS = [Direction.North, Direction.South]
      const wallsEW = [Direction.West, Direction.East]
      for (let i = 0; i < 3; i++) {
        const randomRow = this.getRandomInt(rowStart, rowEnd );
        const randomCol = this.getRandomInt(colStart, colEnd);
        const randomIdx1 = Math.floor(Math.random() * wallsNS.length);
        const randomIdx2 = Math.floor(Math.random() * wallsEW.length);

        const nsWallCheck = this.wallPositionsToCheck(wallsNS[randomIdx1]!, { row: randomRow, column: randomCol });
        const ewWallCheck = this.wallPositionsToCheck(wallsEW[randomIdx2]!, { row: randomRow, column: randomCol });

        if (!this.duplicateWall(nsWallCheck) && !this.duplicateWall(ewWallCheck)) {
            this.withWall(wallsNS[randomIdx1]!, { row: randomRow, column: randomCol })
            .withWall(wallsEW[randomIdx2]!, { row: randomRow, column: randomCol })
          }
          else {
            i -= 1
        }  
      }
    }
  }

  wallPositionsToCheck(wallDirection: Direction,positionProspect: Position) {
    const postitionsToCheck: [Direction, Position][] = []
    postitionsToCheck.push([wallDirection, positionProspect])
    
    switch(wallDirection) {
      case Direction.North:
        postitionsToCheck.push([Direction.South ,{ row: positionProspect.row - 1, column: positionProspect.column }]);
        break;
      case Direction.South:
        postitionsToCheck.push([Direction.North, { row: positionProspect.row + 1, column: positionProspect.column }]);
        break
      case Direction.East:
        postitionsToCheck.push([Direction.West ,{ row: positionProspect.row, column: positionProspect.column + 1 }]);
        break;
      case Direction.West:
        postitionsToCheck.push([Direction.East ,{ row: positionProspect.row, column: positionProspect.column - 1 }]);;
        break;
    }
    return postitionsToCheck
  }

  duplicateWall(postitionsToCheck: [Direction, Position][]) {
    
    for (let [wallDirection, { row, column }] of postitionsToCheck) {
      const alreadyExists = this.walls.some(([existingDirection, existingPosition]) => {
        return (
          existingDirection === wallDirection
          && row === existingPosition.row
          && column === existingPosition.column
        )
      })
      if (alreadyExists) {
        return true
      }
    }
    return false 
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
