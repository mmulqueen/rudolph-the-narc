import { GameObjects, Scene } from 'phaser';
import { LANE_COUNT, PLAYABLE_HEIGHT, SCALE_FACTOR, RUDOLPH_START_LANE, RUDOLPH_Y_OFFSET, getLaneX } from '../data/dimensions';
import { BG_SCROLL_SPEED } from '../data/movement';

export class Rudolph extends GameObjects.Sprite {
    private currentLane: number = RUDOLPH_START_LANE;
    private isPursuitMode: boolean = false;

    constructor(scene: Scene) {
        const startX = getLaneX(RUDOLPH_START_LANE);
        const startY = PLAYABLE_HEIGHT - RUDOLPH_Y_OFFSET;

        super(scene, startX, startY, 'rudolph_patrol');

        scene.add.existing(this);
        this.setScale(SCALE_FACTOR);
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

    setAnimationSpeed(scrollSpeed: number): void {
        // Scale animation proportional to background scroll speed
        this.anims.timeScale = scrollSpeed / BG_SCROLL_SPEED;
    }
}
