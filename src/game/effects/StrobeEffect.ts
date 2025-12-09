import { Scene, GameObjects } from 'phaser';
import { GAME_WIDTH, CENTRE_X, PLAYABLE_HEIGHT } from '../data/dimensions';
import { STROBE_INTERVAL_MS } from '../data/movement';
import { COLOURS } from '../data/style';

export interface StrobeEffectOptions {
    height?: number;
    startVisible?: boolean;
}

export class StrobeEffect {
    private scene: Scene;
    private overlay: GameObjects.Rectangle;
    private timer: number = 0;
    private isRed: boolean = true;

    constructor(scene: Scene, options: StrobeEffectOptions = {}) {
        this.scene = scene;
        const height = options.height ?? PLAYABLE_HEIGHT;
        this.overlay = this.scene.add.rectangle(
            CENTRE_X,
            height / 2,
            GAME_WIDTH,
            height,
            COLOURS.STROBE_RED,
            COLOURS.STROBE_ALPHA
        );
        this.overlay.setVisible(options.startVisible ?? false);
    }

    update(delta: number): void {
        if (!this.overlay.visible) return;

        this.timer += delta;
        if (this.timer >= STROBE_INTERVAL_MS) {
            this.timer = 0;
            this.isRed = !this.isRed;
            this.overlay.setFillStyle(
                this.isRed ? COLOURS.STROBE_RED : COLOURS.STROBE_BLUE,
                COLOURS.STROBE_ALPHA
            );
        }
    }

    show(): void {
        this.overlay.setVisible(true);
        this.timer = 0;
    }

    hide(): void {
        this.overlay.setVisible(false);
    }

    getOverlay(): GameObjects.Rectangle {
        return this.overlay;
    }

    destroy(): void {
        this.overlay.destroy();
    }
}
