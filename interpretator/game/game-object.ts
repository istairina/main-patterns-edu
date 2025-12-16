export interface UObject {
    id: number;
    posX: number;
    posY: number;
}

export interface MovableObject extends UObject {
    velocityX: number;
    velocityY: number;
}

export class StaticObject implements UObject {
    constructor(
        public id: number,
        public posX: number,
        public posY: number
    ) { }

    getPosition(): { posX: number; posY: number } {
        return {
            posX: this.posX,
            posY: this.posY
        };
    }

    setPosition(posX: number, posY: number): void {
        this.posX = posX;
        this.posY = posY;
    }
}

export class MovableObjectClass implements MovableObject {
    public velocityX: number = 0;
    public velocityY: number = 0;

    constructor(
        public id: number,
        public posX: number,
        public posY: number,
        velocityX: number = 0,
        velocityY: number = 0
    ) {
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    getPosition(): { posX: number; posY: number } {
        return {
            posX: this.posX,
            posY: this.posY
        };
    }

    setPosition(posX: number, posY: number): void {
        this.posX = posX;
        this.posY = posY;
    }

    getVelocity(): { velocityX: number; velocityY: number } {
        return {
            velocityX: this.velocityX,
            velocityY: this.velocityY
        };
    }

    setVelocity(velocityX: number, velocityY: number): void {
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    updatePosition(): void {
        this.posX += this.velocityX;
        this.posY += this.velocityY;
    }
}