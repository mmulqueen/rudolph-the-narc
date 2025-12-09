import { Scene } from 'phaser';
import { CENTRE_X } from '../data/dimensions';
import { COLOURS, TEXT_STYLES } from '../data/style';
import { GAME_OVER_LAYOUT } from '../data/ui';
import { createBlinkingTween } from '../ui/blinkingText';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        const finalScore = this.registry.get('finalScore') || 0;
        const isWin = this.registry.get('isWin') || false;

        // Different background for win vs lose
        this.cameras.main.setBackgroundColor(isWin ? 0x006400 : COLOURS.GAME_OVER_BG);

        // Title based on win/lose
        const title = isWin ? 'YOU WIN!' : 'GAME OVER';
        this.add.text(CENTRE_X, GAME_OVER_LAYOUT.TITLE_Y, title, TEXT_STYLES.GAME_OVER_TITLE).setOrigin(0.5);

        this.add.text(CENTRE_X, GAME_OVER_LAYOUT.SCORE_Y, `Score: ${finalScore}`, TEXT_STYLES.FINAL_SCORE).setOrigin(0.5);

        const restartText = this.add.text(CENTRE_X, GAME_OVER_LAYOUT.RESTART_PROMPT_Y, 'TAP TO PLAY AGAIN', TEXT_STYLES.RESTART_PROMPT).setOrigin(0.5);

        createBlinkingTween(this, restartText);

        this.input.once('pointerdown', () => this.scene.start('MainMenu'));
    }
}
