import { Direction } from './direction';

/**
 * Encapsulates the state of a cell on the board including:
 *   - Does it have any walls?
 *   - Is it one of the center pieces?
 *   - Is it the current target?
 */
export class Cell {
  public walls: Direction[];
  public isTarget: boolean;
  public isObstructed: boolean;

  public constructor() {
    this.walls = [];
    this.isTarget = false;
    this.isObstructed = false;
  }

  /**
   * Adds a wall to the cell if it isn't already present
   * @param wall - The wall to be added to the cell
   */
  public addWall(wall: Direction) {
    if (!this.walls.includes(wall)) {
      this.walls.push(wall);
    }
  }

  /**
   * Removes a wall from the cell if it is present
   * @param wall - The wall to be removed from the cell
   */
  public removeWall(wall: Direction) {
    let i = this.walls.indexOf(wall);
    if (i > -1) {
      this.walls.splice(i, 1);
    }
  }
}
