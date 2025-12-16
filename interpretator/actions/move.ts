export class Move {

    constructor(private posX: number, private posY: number, private velocityX: number, private velocityY: number) {

    }

    execute() {
        this.posX += this.velocityX;
        this.posY += this.velocityY;
    }

    getPosition() {
        return {
            posX: this.posX,
            posY: this.posY,
        }
    }
}