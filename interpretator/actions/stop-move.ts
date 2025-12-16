import { IAction } from './action-registry';
import { NewGame } from './new-game';

export class StopMove implements IAction {
    constructor(private objectId: number) { }

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

        obj.setVelocity(0, 0);
        console.log(`Movement stopped for object ${this.objectId}`);
    }
}
