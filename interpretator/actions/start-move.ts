import { MovableObjectClass } from '../game/game-object';
import { IAction } from './action-registry';
import { NewGame } from './new-game';

export class StartMove implements IAction {
    private isMoving: boolean = false;
    private movableObject: MovableObjectClass | null = null;

    constructor(
        private objectId: number,
        private velocityX: number = 0,
        private velocityY: number = 0
    ) { }

    execute(): void {
        const game = NewGame.getGame();
        if (!game) {
            console.error('Game is not created. Please create a game first.');
            return;
        }

        const obj = game.getMovableObjectById(this.objectId);
        if (!obj) {
            console.error(`Movable object with id ${this.objectId} not found`);
            return;
        }

        if (!this.isMoving) {
            this.movableObject = obj;
            this.movableObject.setVelocity(this.velocityX, this.velocityY);
            this.isMoving = true;
        } else {
            console.log('Movement is already in progress');
        }
    }

    getMovableObject(): MovableObjectClass | null {
        return this.movableObject;
    }

    isActive(): boolean {
        return this.isMoving;
    }

    finish(): void {
        if (this.movableObject) {
            this.movableObject.setVelocity(0, 0);
            this.isMoving = false;
        }
    }
}
