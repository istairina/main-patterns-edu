import { StaticObject, MovableObjectClass } from './game-object';

export class Game {
    private staticObject: StaticObject;
    private movableObject1: MovableObjectClass;
    private movableObject2: MovableObjectClass;

    constructor() {
        this.staticObject = new StaticObject(1, 0, 0);

        this.movableObject1 = new MovableObjectClass(2, 10, 10, 0, 0);
        this.movableObject2 = new MovableObjectClass(3, 20, 20, 0, 0);
    }

    getStaticObject(): StaticObject {
        return this.staticObject;
    }

    getMovableObject1(): MovableObjectClass {
        return this.movableObject1;
    }

    getMovableObject2(): MovableObjectClass {
        return this.movableObject2;
    }

    getAllObjects(): { static: StaticObject; movable1: MovableObjectClass; movable2: MovableObjectClass } {
        return {
            static: this.staticObject,
            movable1: this.movableObject1,
            movable2: this.movableObject2
        };
    }

    getObjectById(id: number): StaticObject | MovableObjectClass | null {
        if (this.staticObject.id === id) {
            return this.staticObject;
        }
        if (this.movableObject1.id === id) {
            return this.movableObject1;
        }
        if (this.movableObject2.id === id) {
            return this.movableObject2;
        }
        return null;
    }

    getMovableObjectById(id: number): MovableObjectClass | null {
        const obj = this.getObjectById(id);
        if (obj && 'velocityX' in obj) {
            return obj as MovableObjectClass;
        }
        return null;
    }
}