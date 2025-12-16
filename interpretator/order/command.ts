import { UOrder } from './order-type';
import { IActionFactory } from '../actions/action-factory';
import { IAction } from '../actions';

export class Command {
    constructor(private actionFactory: IActionFactory) { }

    execute(order: UOrder): { success: boolean; action?: IAction; error?: string } {
        const actionInstance = this.actionFactory.createFromOrder(order);

        if (!actionInstance) {
            return {
                success: false,
                error: `Action "${order.action}" not found or failed to create`
            };
        }

        try {
            actionInstance.execute();
            return {
                success: true,
                action: actionInstance
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }
}

