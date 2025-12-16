import { StartMove } from './start-move';
import { StopMove } from './stop-move';
import { Shoot } from './shoot';
import { NewGame } from './new-game';

export interface IAction {
    execute(): void;
}

type ActionConstructor = new (...args: any[]) => IAction;

export class ActionRegistry {
    private static registry: Map<string, ActionConstructor> = (() => {
        const map = new Map<string, ActionConstructor>();
        map.set('StartMove', StartMove);
        map.set('StopMove', StopMove);
        map.set('Shoot', Shoot);
        map.set('NewGame', NewGame);
        return map;
    })();

    static register(name: string, actionClass: ActionConstructor): void {
        this.registry.set(name, actionClass);
    }

    static get(name: string): ActionConstructor | undefined {
        return this.registry.get(name);
    }

    static has(name: string): boolean {
        return this.registry.has(name);
    }

    static getAllNames(): string[] {
        return Array.from(this.registry.keys());
    }
}

