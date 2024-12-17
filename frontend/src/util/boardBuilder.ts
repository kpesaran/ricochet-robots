import { Board } from '../board/board';
import { Robot } from '../board/robot';
import { Direction } from '../board/direction';
import type { Position } from '../board/position';
import { BOARD_SIZE } from '../board/board';
import { Color } from '../board/color'


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

  public generateRandomPairedWalls() {
    // NW
    this.placePairWallsInQuadrant(1,  1, BOARD_SIZE /2 - 1 , BOARD_SIZE/ 2 - 1)
    // NE
    this.placePairWallsInQuadrant( BOARD_SIZE / 2, BOARD_SIZE - 2, 1, BOARD_SIZE / 2 - 1)
    // // SW
    this.placePairWallsInQuadrant( BOARD_SIZE / 2, 1, BOARD_SIZE - 1, BOARD_SIZE / 2 - 1)
    // // SE
    this.placePairWallsInQuadrant(BOARD_SIZE / 2 , BOARD_SIZE / 2, BOARD_SIZE - 1, BOARD_SIZE - 1)

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

    return this
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
      let retryLimit = 20
      const wallsNS = [Direction.North, Direction.South]
      const wallsEW = [Direction.West, Direction.East]
      let attempt = 0
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
        attempt += 1
        if (attempt === retryLimit) {
          break
        }
      }
    }
  }

  wallPositionsToCheck(wallDirection: Direction, positionProspect: Position) {
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
      // ignoring south and east 
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
    return this

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
    return this
  }
  generateRandomPiecePlacement(board: Board) {
    const openPositions = board.generateOpenPositions(BOARD_SIZE)
    const targetChipPosition = board.getRandomOpenPosition(openPositions)
    this.withTargetCell(targetChipPosition!)

    const robotColors = [Color.Blue, Color.Red, Color.Green, Color.Yellow]
    
    board.shuffleRobots()
    
    for (let i = 0; i < 4; i++) {
      this.withRobot(new Robot(robotColors[i]!), board.getRandomOpenPosition(openPositions)!)
    }
    this.generateRandomEdgeWalls()
    this.generateRandomPairedWalls()
    return this
  }
   
  public build() {
    let board = new Board();
  
    this.addWalls(board);
    this.addRobots(board);
    this.addTargetCell(board)

    return board;
  }
  
  public buildRandom() {
    let board = new Board();
    this.generateRandomPiecePlacement(board)
    this.addWalls(board);
    this.addRobots(board);
    this.addTargetCell(board)
    

    return board;
  }
}
