import { Scene } from 'phaser';
import { GameplayController } from '../controllers/GameplayController';
import { FlashMessage } from '../ui/FlashMessage';
import { TEXT_STYLES } from '../data/style';
import { ElfTypes, SCORE_CONTRABAND, SCORE_WRONGFUL, SCORE_ESCAPE, SCORE_WIN_THRESHOLD, SCORE_LOSE_THRESHOLD } from '../data/scoring';
import { MESSAGES_BUSTED, MESSAGES_WRONGFUL, MESSAGES_ESCAPED } from '../data/gameMessages';
import { ELF_SPAWN_INTERVAL_MS, BG_SCROLL_SPEED } from '../data/movement';
import { UI_COMMON } from '../data/ui';

export class Game extends Scene {
    private controller!: GameplayController;
    private flashMessage!: FlashMessage;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    create(): void {
        this.score = 0;
        this.flashMessage = new FlashMessage(this);

        // Create gameplay controller with game-specific config
        this.controller = new GameplayController({
            scene: this,
            onArrest: (_elf, isContraband) => {
                this.addScore(isContraband ? SCORE_CONTRABAND : SCORE_WRONGFUL);
                if (isContraband) {
                    const msg = Phaser.Math.RND.pick(MESSAGES_BUSTED);
                    this.flashMessage.show('BUSTED!', msg, 0x00ff00);
                } else {
                    const msg = Phaser.Math.RND.pick(MESSAGES_WRONGFUL);
                    this.flashMessage.show('WRONGFUL ARREST!', msg, 0xff0000);
                }
            },
            onEscape: (elf) => {
                if (elf.isContraband()) {
                    this.addScore(SCORE_ESCAPE);
                    const msg = Phaser.Math.RND.pick(MESSAGES_ESCAPED);
                    this.flashMessage.show('ESCAPED!', msg, 0xff0000);
                }
            },
            elfTypePool: [
                ElfTypes.SNOW,
                ElfTypes.TEDDY,
                ElfTypes.TEDDY,
                ElfTypes.CANDY,
                ElfTypes.CANDY,
                ElfTypes.COAL,
                ElfTypes.COAL,
                ElfTypes.NOTHING,
                ElfTypes.NOTHING,
                ElfTypes.NOTHING
            ],
            spawnInterval: ELF_SPAWN_INTERVAL_MS,
            showStrobe: true,
            bgScrollSpeed: BG_SCROLL_SPEED,
            showBackground: true
        });
        this.controller.create();

        // Create score display (game-specific)
        this.scoreText = this.add.text(UI_COMMON.SCORE_X, UI_COMMON.SCORE_Y, 'Score: 0', TEXT_STYLES.SCORE);
    }

    update(_time: number, delta: number): void {
        this.controller.update(delta);
    }

    private addScore(points: number): void {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);

        // Check win/lose conditions
        if (this.score >= SCORE_WIN_THRESHOLD) {
            this.endGame(true);
        } else if (this.score <= SCORE_LOSE_THRESHOLD) {
            this.endGame(false);
        }
    }

    private endGame(isWin: boolean): void {
        this.registry.set('finalScore', this.score);
        this.registry.set('isWin', isWin);
        this.scene.start('GameOver');
    }
}
