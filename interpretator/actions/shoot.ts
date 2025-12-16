import { IAction } from './action-registry';

export class Shoot implements IAction {
    private bulletsFired: number = 0;

    constructor(
        private damage: number = 10,
        private range: number = 100
    ) { }

    execute(): void {
        this.bulletsFired++;
        console.log(`Shoot executed`);
    }

    getBulletsFired(): number {
        return this.bulletsFired;
    }

    getDamage(): number {
        return this.damage;
    }

    getRange(): number {
        return this.range;
    }

    setDamage(damage: number): void {
        this.damage = damage;
    }

    setRange(range: number): void {
        this.range = range;
    }
}

