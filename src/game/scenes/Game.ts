import { Scene } from 'phaser';
import { GameplayController } from '../controllers/GameplayController';
import { FlashMessage } from '../ui/FlashMessage';
import { TEXT_STYLES } from '../data/style';
import { ElfTypes, SCORE_WIN_THRESHOLD, SCORE_LOSE_THRESHOLD } from '../data/scoring';
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
            bgScrollSpeed: BG_SCROLL_SPEED,
            getScore: () => this.score,
            onArrest: (elf) => {
                const event = elf.getArrestEvent();
                this.addScore(event.scoreDelta);
                const colour = event.scoreDelta > 0 ? 0x00ff00 : 0xff0000;
                this.flashMessage.show(event.header, event.message, colour);
            },
            onEscape: (elf) => {
                const event = elf.getEscapeEvent();
                if (event) {
                    this.addScore(event.scoreDelta);
                    this.flashMessage.show(event.header, event.message, 0xff0000);
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
                ElfTypes.NOTHING,
                ElfTypes.SANTA_SNOW,
                ElfTypes.SANTA_NOTHING
            ],
            spawnInterval: ELF_SPAWN_INTERVAL_MS,
            showStrobe: true
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

        // Update difficulty based on progress toward win threshold
        this.updateDifficulty();

        // Check win/lose conditions
        if (this.score >= SCORE_WIN_THRESHOLD) {
            this.endGame(true);
        } else if (this.score <= SCORE_LOSE_THRESHOLD) {
            this.endGame(false);
        }
    }

    private updateDifficulty(): void {
        // Ramp difficulty from 1.0 to 2.0 as score goes from 0 to 100
        // Only increase difficulty for positive scores
        const progress = Math.max(0, this.score) / SCORE_WIN_THRESHOLD;
        const difficulty = 1.0 + progress;
        this.controller.setDifficulty(difficulty);
    }

    private endGame(isWin: boolean): void {
        this.registry.set('finalScore', this.score);
        this.registry.set('isWin', isWin);
        this.scene.start('GameOver');
    }
}
