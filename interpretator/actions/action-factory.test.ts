import { ActionFactory } from './action-factory';
import { ActionRegistry } from './action-registry';
import { StartMove } from './start-move';
import { StopMove } from './stop-move';
import { Shoot } from './shoot';
import { NewGame } from './new-game';

describe('ActionFactory', () => {
    let factory: ActionFactory;

    beforeEach(() => {
        factory = new ActionFactory();
        (NewGame as any).currentGame = null;
    });

    describe('create', () => {
        it('should create StartMove action', () => {
            const action = factory.create('StartMove', 2, 5, 10);

            expect(action).toBeInstanceOf(StartMove);
            expect(action).not.toBeNull();
        });

        it('should create StopMove action', () => {
            const action = factory.create('StopMove', 2);

            expect(action).toBeInstanceOf(StopMove);
            expect(action).not.toBeNull();
        });

        it('should create Shoot action', () => {
            const action = factory.create('Shoot', 20, 150);

            expect(action).toBeInstanceOf(Shoot);
            expect(action).not.toBeNull();
        });

        it('should create NewGame action', () => {
            const action = factory.create('NewGame');

            expect(action).toBeInstanceOf(NewGame);
            expect(action).not.toBeNull();
        });

        it('should return null for non-existent action', () => {
            const action = factory.create('NonExistentAction');

            expect(action).toBeNull();
        });
    });

    describe('createFromOrder', () => {
        it('should create action from order with action name', () => {
            const order = {
                action: 'StartMove',
                objectId: 2,
                velocityX: 5,
                velocityY: 10
            };

            const action = factory.createFromOrder(order);

            expect(action).toBeInstanceOf(StartMove);
            expect(action).not.toBeNull();
        });

        it('should extract and pass parameters from order', () => {
            const order = {
                action: 'Shoot',
                damage: 50,
                range: 200
            };

            const action = factory.createFromOrder(order) as Shoot;

            expect(action).toBeInstanceOf(Shoot);
            expect(action.getDamage()).toBe(50);
            expect(action.getRange()).toBe(200);
        });

        it('should handle order with id parameter', () => {
            const order = {
                id: 1,
                action: 'StopMove',
                objectId: 2
            };

            const action = factory.createFromOrder(order);

            expect(action).toBeInstanceOf(StopMove);
            expect(action).not.toBeNull();
        });

        it('should handle order with extra parameters', () => {
            const order = {
                action: 'StartMove',
                objectId: 2,
                velocityX: 3,
                velocityY: 4,
                extraParam: 'should be ignored'
            };

            const action = factory.createFromOrder(order);

            expect(action).toBeInstanceOf(StartMove);
            expect(action).not.toBeNull();
        });
    });

    describe('IoC integration', () => {
        it('should use ActionRegistry for action lookup', () => {
            const originalGet = ActionRegistry.get;
            const mockGet = jest.fn().mockReturnValue(StartMove);
            ActionRegistry.get = mockGet;

            try {
                factory.create('StartMove', 2, 5, 10);

                expect(mockGet).toHaveBeenCalledWith('StartMove');
            } finally {
                ActionRegistry.get = originalGet;
            }
        });
    });
});

