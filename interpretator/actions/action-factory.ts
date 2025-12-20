import { IAction, ActionRegistry } from './action-registry';


export interface IActionFactory {
    createFromOrder(order: { action: string;[key: string]: any }): IAction | null;
}

export class ActionFactory implements IActionFactory {
    create(actionName: string, ...args: any[]): IAction | null {
        const ActionClass = ActionRegistry.get(actionName);

        if (!ActionClass) {
            console.error(`Action "${actionName}" not found in registry`);
            return null;
        }

        try {
            return new ActionClass(...args);
        } catch (error) {
            console.error(`Failed to create action "${actionName}":`, error);
            return null;
        }
    }

    createFromOrder(order: { action: string;[key: string]: any }): IAction | null {
        const { action, ...params } = order;
        const args = Object.values(params);
        return this.create(action, ...args);
    }
}

