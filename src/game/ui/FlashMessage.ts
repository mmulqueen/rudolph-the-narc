import { Scene, GameObjects } from 'phaser';
import { GAME_WIDTH, CENTRE_X, PLAYABLE_HEIGHT } from '../data/dimensions';
import { FLASH_MESSAGE_HOLD_MS, FLASH_MESSAGE_FADE_MS } from '../data/movement';
import { COLOURS, TEXT_STYLES } from '../data/style';
import { FLASH_MESSAGE_LAYOUT } from '../data/ui';

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
        const bgWidth = GAME_WIDTH - FLASH_MESSAGE_LAYOUT.MARGIN;
        const bgHeight = FLASH_MESSAGE_LAYOUT.HEIGHT;
        const bg = this.scene.add.rectangle(0, 0, bgWidth, bgHeight, COLOURS.FLASH_BG, COLOURS.FLASH_BG_ALPHA);
        bg.setStrokeStyle(FLASH_MESSAGE_LAYOUT.STROKE_WIDTH, headerColour);
        this.container.add(bg);

        // Header text
        const headerText = this.scene.add.text(0, FLASH_MESSAGE_LAYOUT.HEADER_Y_OFFSET, header, {
            ...TEXT_STYLES.FLASH_HEADER,
            color: '#' + headerColour.toString(16).padStart(6, '0')
        }).setOrigin(0.5);
        this.container.add(headerText);

        // Message text (word-wrapped)
        const messageText = this.scene.add.text(0, FLASH_MESSAGE_LAYOUT.MESSAGE_Y_OFFSET, message, {
            ...TEXT_STYLES.FLASH_MESSAGE,
            wordWrap: { width: bgWidth - FLASH_MESSAGE_LAYOUT.TEXT_PADDING }
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
