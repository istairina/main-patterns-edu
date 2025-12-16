import { Game } from '../game/game';
import { IAction } from './action-registry';

export class NewGame implements IAction {
    private static currentGame: Game | null = null;

    constructor() { }

    execute(): void {
        if (!NewGame.currentGame) {
            NewGame.currentGame = new Game();
            console.log('New game created with 1 static object and 2 movable objects');
        } else {
            console.log('Game is already created');
        }
    }

    static getGame(): Game | null {
        return NewGame.currentGame;
    }

    static hasGame(): boolean {
        return NewGame.currentGame !== null;
    }
}

