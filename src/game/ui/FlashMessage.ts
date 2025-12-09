import { Scene, GameObjects } from 'phaser';
import { GAME_WIDTH, CENTRE_X, PLAYABLE_HEIGHT } from '../data/dimensions';
import { FLASH_MESSAGE_HOLD_MS, FLASH_MESSAGE_FADE_MS } from '../data/movement';
import { COLOURS, TEXT_STYLES } from '../data/style';

export class FlashMessage {
    private scene: Scene;
    private container?: GameObjects.Container;
    private fadeOutTween?: Phaser.Tweens.Tween;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    show(header: string, message: string, headerColour: number): void {
        // Destroy existing message (replace mode)
        this.destroy();

        const centreY = PLAYABLE_HEIGHT / 2;

        // Create container
        this.container = this.scene.add.container(CENTRE_X, centreY);

        // Semi-transparent background
        const bgWidth = GAME_WIDTH - 20;
        const bgHeight = 70;
        const bg = this.scene.add.rectangle(0, 0, bgWidth, bgHeight, COLOURS.FLASH_BG, COLOURS.FLASH_BG_ALPHA);
        bg.setStrokeStyle(2, headerColour);
        this.container.add(bg);

        // Header text
        const headerText = this.scene.add.text(0, -18, header, {
            ...TEXT_STYLES.FLASH_HEADER,
            color: '#' + headerColour.toString(16).padStart(6, '0')
        }).setOrigin(0.5);
        this.container.add(headerText);

        // Message text (word-wrapped)
        const messageText = this.scene.add.text(0, 12, message, {
            ...TEXT_STYLES.FLASH_MESSAGE,
            wordWrap: { width: bgWidth - 20 }
        }).setOrigin(0.5);
        this.container.add(messageText);

        // Start fully visible
        this.container.setAlpha(1);

        // Hold then fade out
        this.fadeOutTween = this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            delay: FLASH_MESSAGE_HOLD_MS,
            duration: FLASH_MESSAGE_FADE_MS,
            onComplete: () => {
                this.destroy();
            }
        });
    }

    destroy(): void {
        if (this.fadeOutTween) {
            this.fadeOutTween.stop();
            this.fadeOutTween = undefined;
        }
        if (this.container) {
            this.container.destroy();
            this.container = undefined;
        }
    }
}
