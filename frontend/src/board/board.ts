import { Cell } from './cell';
import { Color } from './color';
import { Robot } from './robot';
import type { Position } from './position';
import { Direction } from './direction';
// import { Direction } from './direction'

/*
 * The height and width of the board
 */
export const BOARD_SIZE = 16;

export class Board {
  cells: Cell[][] ;
  robots: [Robot, Robot, Robot, Robot];
  robotPositions: [Position, Position, Position, Position];


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
      new Robot(Color.Red),
      new Robot(Color.Yellow),
      new Robot(Color.Green),
      new Robot(Color.Blue),
    ];

    this.robotPositions = [
      { row: 0, column: 0},
      { row: 0, column: 1},
      { row: 0, column: 2},
      { row: 0, column: 3},
    ];
  


  }

  findTargetCell() {
    for (let row = 0; row < this.cells.length; row++) {
      if (this.cells[row]) {
        const len = this.cells[row]?.length || 0
        for (let col = 0; col < len; col++) {
          if (this.cells[row]?.[col]?.isTarget) {
            return { row: row, column: col };
          }
        }
      }
    }
    return null
  }
  
  


  findMoves() {
    return {
      north: this.checkDirections(this.robotPositions[0].row, this.robotPositions[0].column, 'North'),
    south: this.checkDirections(this.robotPositions[0].row, this.robotPositions[0].column, 'South'),
    east: this.checkDirections(this.robotPositions[0].row, this.robotPositions[0].column, 'East'),
    west: this.checkDirections(this.robotPositions[0].row, this.robotPositions[0].column, 'West')
    }
  }

  checkDirections(startRow:number, startCol: number, direction: 'North' | 'South' | 'East' | 'West' ) : null | Position {
    // Gets the position of the target robot
    // Checks the north, south, east, and west path
    // Path ends if
    // - it is the last cell in the direction
    // - or the cell is obstructed with either another robot, a wall, or the center pieces
    // - or the cell is the target cell

    let legalMove: Position | null = null 
    
    
    let row = startRow
    let col = startCol
 
    while (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {

      // check if target, add position

      let robotEncountered = false 
      // robots 
      this.robotPositions.forEach(robot => {
        // designated robot does not check its own position
        if (robot.row === startRow && robot.column === startCol) {
          return 
        }
        if (row === robot.row && col === robot.column) {
          robotEncountered = true 
        }
      })

      if (robotEncountered) {
        break; 
      }


      if (this.cells[row]?.[col]?.isTarget) {
        legalMove = {row: row, column: col}
        break
      }

      
      // check if obstructed
      if (this.cells[row]?.[col]?.isObstructed) {
        break
      }

      let wallPreventsExit = false 
      // check if wall exists
      if (this.cells[row]?.[col]?.walls?.length! > 0) {
  
        this.cells[row]?.[col]?.walls.forEach(wall => {
          // Wall prevents exit into next cell
          if ((direction === 'North' && wall === Direction.North) || 
            (direction === 'South' && wall === Direction.South) ||
            (direction === 'East' && wall === Direction.East) ||
            (direction === 'West' && wall === Direction.West)) {
            wallPreventsExit = true

            if (!(row === startRow && col === startCol))
            legalMove = {row: row, column:col}
          } 
          
    
        })
      }
      if (wallPreventsExit) {
        
        break
      }
  
      
      if (!(row === startRow && col === startCol)) {
        legalMove = {row: row, column: col}
      }

      if (direction === 'North') {
        row--;
      } else if (direction === 'South') {
        row++;
      } else if (direction === 'East') {
        col++;
      } else if (direction === 'West') {
        col--;
      }
    
    }
    return legalMove 
    
  }
}
