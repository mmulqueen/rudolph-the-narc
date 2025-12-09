import { GameObjects, Scene } from 'phaser';
import { LANE_COUNT, PLAYABLE_HEIGHT, getLaneX } from '../data/dimensions';

export class Rudolph extends GameObjects.Sprite {
    private currentLane: number = 3;
    private isPursuitMode: boolean = false;

    constructor(scene: Scene) {
        const startX = getLaneX(3);
        const startY = PLAYABLE_HEIGHT - 40;

        super(scene, startX, startY, 'rudolph_patrol');

        scene.add.existing(this);
        this.play('rudolph_patrol_walk');
    }

    moveLeft(): void {
        if (this.currentLane > 0) {
            this.currentLane--;
            this.x = getLaneX(this.currentLane);
        }
    }

    moveRight(): void {
        if (this.currentLane < LANE_COUNT - 1) {
            this.currentLane++;
            this.x = getLaneX(this.currentLane);
        }
    }

    activatePursuit(): void {
        if (!this.isPursuitMode) {
            this.isPursuitMode = true;
            this.setTexture('rudolph_pursuit');
            this.play('rudolph_pursuit_walk');
        }
    }

    deactivatePursuit(): void {
        if (this.isPursuitMode) {
            this.isPursuitMode = false;
            this.setTexture('rudolph_patrol');
            this.play('rudolph_patrol_walk');
        }
    }

    getCurrentLane(): number {
        return this.currentLane;
    }
}
