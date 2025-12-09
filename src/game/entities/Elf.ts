import { GameObjects, Scene } from 'phaser';
import { PLAYABLE_HEIGHT, SPRITE_OFF_SCREEN_OFFSET, SCALE_FACTOR, getLaneX } from '../data/dimensions';
import { ElfType, ElfTypes } from '../data/scoring';

export class Elf extends GameObjects.Sprite {
    private elfType: ElfType;
    private lane: number;
    private speed: number;
    private isStopped: boolean = false;

    constructor(scene: Scene, lane: number, elfType: ElfType, speed: number) {
        const spriteKey = `elf_${elfType}`;
        const startX = getLaneX(lane);
        const startY = PLAYABLE_HEIGHT + SPRITE_OFF_SCREEN_OFFSET;

        super(scene, startX, startY, spriteKey);

        this.elfType = elfType;
        this.lane = lane;
        this.speed = speed;

        scene.add.existing(this);
        this.setScale(SCALE_FACTOR);
        this.play(`${spriteKey}_walk`);
    }

    update(delta: number, backgroundScrollSpeed: number): void {
        if (this.isStopped) {
            // Move with background (appears stationary relative to ground)
            this.y += backgroundScrollSpeed * (delta / 1000);
        } else {
            // Normal movement upward (decreasing Y)
            this.y -= this.speed * (delta / 1000);
        }
    }

    freeze(): void {
        this.isStopped = true;
        this.anims.pause();
    }

    unfreeze(): void {
        this.isStopped = false;
        this.anims.resume();
    }

    getLane(): number {
        return this.lane;
    }

    getElfType(): ElfType {
        return this.elfType;
    }

    hasEscaped(): boolean {
        return this.y < -SPRITE_OFF_SCREEN_OFFSET;
    }

    isContraband(): boolean {
        return this.elfType === ElfTypes.SNOW;
    }
}
