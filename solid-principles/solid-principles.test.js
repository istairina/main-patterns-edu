const SpaceObject = require('./solid-principles');

describe('SpaceObjects used SOLID principles', () => {
    it('should move', () => {
        const spaceObject = new SpaceObject.MovableObject();
        spaceObject.setPosition({ x: 12, y: 5 });
        spaceObject.setVelocity({ x: -7, y: 3 });
        spaceObject.move();
        expect(spaceObject.getPosition()).toEqual({ x: 5, y: 8 });
    });

    it('throw exception if position is not set', () => {
        const spaceObject = new SpaceObject.MovableObject();
        spaceObject.setVelocity({ x: -7, y: 3 });
        expect(() =>spaceObject.move()).toThrow();
    });

    it('throw exception if velocity is not set', () => {
        const spaceObject = new SpaceObject.MovableObject();
        spaceObject.setPosition({ x: 12, y: 5 });
        expect(() => spaceObject.move()).toThrow();
    });
});