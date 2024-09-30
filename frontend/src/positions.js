
export default class Positions {
    constructor() {
        this.redRobot = {
            pos: [4, 5],
            color: 'red'
        }
        this.blueRobot = {
            pos: [8, 12],
            color: 'blue'
        }
        this.greenRobot = {
            pos: [9, 10],
            color: 'green'
        }
        this.yellowRobot = {
            pos: [1, 2],
            color: 'yellow'
        }
    
        this.robots = [this.redRobot, this.blueRobot, this.greenRobot, this.yellowRobot]

        this.target = {
            color: 'red',
            pos: [6, 2]
        }

        this.walls = [
            [null, null, null, null, null, ["S", "W"], null, null, null, null, null, null, null, null, null, null],
            [["N", "W"], null, null, null, null, null, null, null, ["S", "E"], null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [["N", "W"], null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, ["S", "E"], null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, ["N", "E"]],
            [null, null, null, null, null, null, null, null, null, ["S", "W"], null, null, null, ["S", "E"], null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
        ];
        
    }
    toJSON() {
        robotPositions = []
        if (this.target.color === 'red') {
    
            robotPositions.push(this.redRobot.pos,this.blueRobot.pos, this.greenRobot.pos, this.yellowRobot.pos)
        }
        else if (this.target.color === 'blue') {
            robotPositions.push(this.blueRobot.pos, this.redRobot.pos, this.greenRobot.pos, this.yellowRobot.pos)
        }
        else if (this.target.color === 'yellow') {
            robotPositions.push(this.yellowRobot.pos, this.redRobot.pos, this.greenRobot.pos, this.blueRobot.pos)
        }
        else {
            robotPositions.push(this.greenRobot.pos, this.redRobot, this.yellowRobot.pos, this.blueRobot.pos)
        }
      
        return JSON.stringify({
            walls: this.walls,
            robotPositions: robotPositions,
            targetCell: this.target.pos
        })
    }

}





