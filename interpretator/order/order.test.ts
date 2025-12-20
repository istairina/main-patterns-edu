import { Command } from './command';
import { ActionFactory } from '../actions/action-factory';
import { IActionFactory } from '../actions/action-factory';
import { UOrder } from './order-type';
import { NewGame } from '../actions/new-game';

describe('Command', () => {
    let command: Command;
    let actionFactory: IActionFactory;

    beforeEach(() => {
        actionFactory = new ActionFactory();
        command = new Command(actionFactory);
        (NewGame as any).currentGame = null;
    });

    describe('execute orders', () => {
        it('should successfully execute StartMove order', () => {
            const order: UOrder = {
                action: 'StartMove',
                objectId: 2,
                velocityX: 5,
                velocityY: 10
            };

            const result = command.execute(order);

            expect(result.success).toBe(true);
            expect(result.action).toBeDefined();
        });

        it('should successfully execute StopMove order', () => {
            new NewGame().execute();
            const startOrder: UOrder = {
                action: 'StartMove',
                objectId: 2,
                velocityX: 5,
                velocityY: 10
            };
            command.execute(startOrder);

            const stopOrder: UOrder = {
                action: 'StopMove',
                objectId: 2
            };

            const result = command.execute(stopOrder);

            expect(result.success).toBe(true);
            expect(result.action).toBeDefined();
        });

        it('should successfully execute Shoot order', () => {
            const order: UOrder = {
                action: 'Shoot',
                damage: 20,
                range: 150
            };

            const result = command.execute(order);

            expect(result.success).toBe(true);
            expect(result.action).toBeDefined();
        });

        it('should successfully execute NewGame order', () => {
            const order: UOrder = {
                action: 'NewGame'
            };

            const result = command.execute(order);

            expect(result.success).toBe(true);
            expect(result.action).toBeDefined();
        });

        it('should return error when action is not found', () => {
            const order: UOrder = {
                action: 'SomeAction'
            };

            const result = command.execute(order);

            expect(result.success).toBe(false);
        });

        it('should handle order with additional parameters', () => {
            const order: UOrder = {
                action: 'Shoot',
                damage: 50,
                range: 200,
                additionalParam: 'test'
            };

            const result = command.execute(order);

            expect(result.success).toBe(true);
            expect(result.action).toBeDefined();
        });
    });
});

