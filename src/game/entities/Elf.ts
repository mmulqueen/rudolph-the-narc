import { GameObjects, Scene, Math as PhaserMath } from 'phaser';
import { PLAYABLE_HEIGHT, SPRITE_OFF_SCREEN_OFFSET, SCALE_FACTOR, getLaneX } from '../data/dimensions';
import { ElfType, ElfTerminalEvent, isContrabandType, isSantaType, SCORE_CONTRABAND, SCORE_WRONGFUL, SCORE_ESCAPE, SANTA_SCORE_MULTIPLIER } from '../data/scoring';
import { ELF_SPEED_MIN, ELF_SPEED_MAX } from '../data/movement';
import { MESSAGES_BUSTED, MESSAGES_WRONGFUL, MESSAGES_ESCAPED, MESSAGES_SANTA_BUSTED, MESSAGES_SANTA_WRONGFUL, MESSAGES_SANTA_ESCAPED } from '../data/gameMessages';

export class Elf extends GameObjects.Sprite {
    readonly elfType: ElfType;
    readonly lane: number;
    readonly hasContraband: boolean;
    readonly isSanta: boolean = false;
    private baseSpeed: number;
    readonly speed: number;
    private isStopped: boolean = false;

    constructor(scene: Scene, lane: number, elfType: ElfType, difficulty: number = 1.0) {
        const startX = getLaneX(lane);
        const startY = PLAYABLE_HEIGHT + SPRITE_OFF_SCREEN_OFFSET;

        super(scene, startX, startY, elfType);

        this.elfType = elfType;
        this.lane = lane;
        this.hasContraband = isContrabandType(elfType);
        this.baseSpeed = PhaserMath.Between(ELF_SPEED_MIN, ELF_SPEED_MAX);
        this.speed = this.baseSpeed * difficulty;

        scene.add.existing(this);
        this.setScale(SCALE_FACTOR);
        this.play(`${elfType}_walk`);

        // Scale animation speed proportional to movement speed
        this.anims.timeScale = this.speed / ELF_SPEED_MIN;
    }

    update(delta: number, backgroundScrollSpeed: number, minY?: number): void {
        if (this.isStopped) {
            // Move with background (appears stationary relative to ground)
            this.y += backgroundScrollSpeed * (delta / 1000);
        } else {
            // Normal movement upward (decreasing Y)
            this.y -= this.speed * (delta / 1000);
            // Don't move past blocking position
            if (minY !== undefined && this.y < minY) {
                this.y = minY;
            }
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

    hasEscaped(): boolean {
        return this.y < -SPRITE_OFF_SCREEN_OFFSET;
    }

    getArrestEvent(): ElfTerminalEvent {
        if (this.hasContraband) {
            return {
                header: 'BUSTED!',
                message: PhaserMath.RND.pick(MESSAGES_BUSTED),
                scoreDelta: SCORE_CONTRABAND
            };
        } else {
            return {
                header: 'WRONGFUL ARREST!',
                message: PhaserMath.RND.pick(MESSAGES_WRONGFUL),
                scoreDelta: SCORE_WRONGFUL
            };
        }
    }

    getEscapeEvent(): ElfTerminalEvent | null {
        if (!this.hasContraband) {
            return null;
        }
        return {
            header: 'ESCAPED!',
            message: PhaserMath.RND.pick(MESSAGES_ESCAPED),
            scoreDelta: SCORE_ESCAPE
        };
    }
}

export class Santa extends Elf {
    readonly isSanta: boolean = true;

    getArrestEvent(): ElfTerminalEvent {
        if (this.hasContraband) {
            return {
                header: 'SANTA BUSTED!',
                message: PhaserMath.RND.pick(MESSAGES_SANTA_BUSTED),
                scoreDelta: SCORE_CONTRABAND * SANTA_SCORE_MULTIPLIER
            };
        } else {
            return {
                header: 'SANTA WAS INNOCENT!',
                message: PhaserMath.RND.pick(MESSAGES_SANTA_WRONGFUL),
                scoreDelta: SCORE_WRONGFUL * SANTA_SCORE_MULTIPLIER
            };
        }
    }

    getEscapeEvent(): ElfTerminalEvent | null {
        if (!this.hasContraband) {
            return null;
        }
        return {
            header: 'SANTA ESCAPED!',
            message: PhaserMath.RND.pick(MESSAGES_SANTA_ESCAPED),
            scoreDelta: SCORE_ESCAPE * SANTA_SCORE_MULTIPLIER
        };
    }
}

// Factory function to create the appropriate entity based on type
export function createElf(scene: Scene, lane: number, elfType: ElfType, difficulty: number = 1.0): Elf {
    if (isSantaType(elfType)) {
        return new Santa(scene, lane, elfType, difficulty);
    }
    return new Elf(scene, lane, elfType, difficulty);
}
