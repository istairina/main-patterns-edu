const SpaceObject = require('./solid-principles');

describe('SpaceObjects used SOLID principles', () => {
    it('should move', () => {
        const spaceObject = new SpaceObject.MovableObject();
        spaceObject.setPosition({ x: 12, y: 5 });
        spaceObject.setVelocity({ x: -7, y: 3 });
        expect(spaceObject.getPosition()).toEqual({ x: 5, y: 8 });
    });
});