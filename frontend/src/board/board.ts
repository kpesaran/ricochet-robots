    import { Cell } from './cell';
import { Color } from './color';
import { Robot } from './robot';
import type { Position } from './position';
import { Direction } from './direction';


/*
 * The height and width of the board
 */
export const BOARD_SIZE = 16;

export class Board {
  cells: Cell[][];
  robots: [Robot, Robot, Robot, Robot];
  robotPositions: [Position, Position, Position, Position];
  // Cacheing versus caluclating 


  constructor() {
    let cells = new Array(BOARD_SIZE)

    for (let r = 0; r < BOARD_SIZE; r++) {
      let row = new Array(BOARD_SIZE);
      for (let c = 0; c < BOARD_SIZE; c++) {
        row[c] = new Cell();
      }
      cells[r] = row
    }

    // The cells in the center of the board
    // are always obstructed
    cells[7][7].isObstructed = true;
    cells[7][8].isObstructed = true;
    cells[8][7].isObstructed = true;
    cells[8][8].isObstructed = true;

    this.cells = cells;
    this.robots = [
      new Robot(Color.Blue),
      new Robot(Color.Red),
      new Robot(Color.Yellow),
      new Robot(Color.Green),
    ];

    this.robotPositions = [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 2 },
      { row: 0, column: 3 },
    ];
    
  }

  shuffleRobots() {
    for (let i = this.robots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.robots[i], this.robots[j]] = [this.robots[j]!, this.robots[i]!];
      
    }
  }

  getTargetColor() {
    return this.robots[0].color
  }

  checkRobotAtTarget() {
    const targetCell = this.findTargetCell()
    return this.robotPositions[0].row === targetCell!.row && this.robotPositions[0].column === targetCell!.column
  }

  getTargetRobotColor() {
    return this.robots[0].color
  }
   
  findTargetCell() {
    if (!this.cells || this.cells.length === 0) {
      console.error("Error: Grid is not initialized properly.");
      return null;
  }
    for (let row = 0; row < this.cells.length; row++) {
      if (this.cells[row]) {
        const len = this.cells[row]!.length
        for (let col = 0; col < len; col++) {
          if (this.cells[row]?.[col]?.isTarget) {
            return { row: row, column: col };
          }
        }
      }
    }
    return null
  }

  findMoves(robotIndex: number) {
    return {
      north: this.checkDirections(this.robotPositions[robotIndex]!, Direction.North),
      south: this.checkDirections(this.robotPositions[robotIndex]!, Direction.South),
      east: this.checkDirections(this.robotPositions[robotIndex]!, Direction.East),
      west: this.checkDirections(this.robotPositions[robotIndex]!, Direction.West)
    }
  }

  checkDirections(startPos: Position, direction: Direction): null | Position {
    if (!startPos) {
      return null
    }
    let legalMove: Position | null = null
    let row = startPos.row
    let col = startPos.column
 
    while (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {

      let robotEncountered = false
      this.robotPositions.forEach(robot => {
        if (robot.row === startPos.row && robot.column === startPos.column) {
          return
        }
        if (row === robot.row && col === robot.column) {
          robotEncountered = true
        }
      })

      if (robotEncountered) {
        break;
      }
      // check if obstructed
      if (this.cells[row]?.[col]?.isObstructed) {
        break
      }

      let wallPreventsEntrance = false
      // check if wall exists
      if (this.cells[row]?.[col]?.walls?.length! > 0) {
  
        this.cells[row]?.[col]?.walls.forEach(wall => {
          // Wall prevents entrance into next cell
          if ((direction === Direction.North && wall === Direction.North) ||
            (direction === Direction.South && wall === Direction.South) ||
            (direction === Direction.East && wall === Direction.East) ||
            (direction === Direction.West && wall === Direction.West)) {
            wallPreventsEntrance = true

            if (!(row === startPos.row && col === startPos.column))
              legalMove = { row: row, column: col }
          }
        })
      }
      if (wallPreventsEntrance) {
        break
      }
      if (!(row === startPos.row && col === startPos.column)) {
        legalMove = { row: row, column: col }
      }
 
      if (direction === Direction.North) {
        row--;
      } else if (direction === Direction.South) {
        row++;
      } else if (direction === Direction.East) {
        col++;
      } else if (direction === Direction.West) {
        col--;
      }
    }

    return legalMove
  }

  updateRobotPosition(newPosition: Position, robotIndex: number) {
    this.robotPositions[robotIndex]!.column = newPosition.column
    this.robotPositions[robotIndex]!.row = newPosition.row
  }

  getRandomOpenPosition(openPositions: Position[]) {
    const randomIndex = Math.floor(Math.random() * openPositions.length)
    return openPositions.splice(randomIndex, 1)[0]
  }

  generateOpenPositions(boardSize: number) {
    const openPositions = []
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        
        if (!this.cells[row]![col]?.isObstructed && !this.cells[row]![col]?.isTarget) {
          openPositions.push({ row: row, column: col })
        }
      }
    }
    return openPositions
  }

  boardStateSerielization() {
    const wallPositions: [Position, Direction][] = []
    let targetCell = null
    for (let row = 0; row < this.cells.length; row++) {
      for (let col = 0; col < this.cells.length; col++) {
        if (this.cells[row]![col]?.isTarget) {
          targetCell = { row: row, column: col };
        }
        if (this.cells[row]![col]?.walls.length! > 0) {
          this.cells[row]![col]?.walls.forEach(wall => {
            wallPositions.push([{ row: row, column: col }, wall]);
          });
        }
      }
    }
    return JSON.stringify({ wallPositions, robotPositions: this.robotPositions, targetCell });
  }

}