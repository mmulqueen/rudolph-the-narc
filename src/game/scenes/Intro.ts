import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, CENTRE_X, SPRITE_OFF_SCREEN_OFFSET, SCALE_FACTOR } from '../data/dimensions';
import { BG_SCROLL_SPEED, ELF_SPEED_MIN } from '../data/movement';
import { ElfTypes } from '../data/scoring';
import { TEXT_STYLES } from '../data/style';
import { INTRO_LAYOUT, UI_ANIMATION } from '../data/ui';
import { GameplayController } from '../controllers/GameplayController';
import { StrobeEffect } from '../effects/StrobeEffect';
import { INTRO_SLIDES } from '../data/introSlides';
import { createBlinkingTween } from '../ui/blinkingText';

export class Intro extends Scene {
    private currentSlide: number = 0;
    private slideElements: Phaser.GameObjects.GameObject[] = [];

    // For interactive slide
    private controller?: GameplayController;

    // For animated slides (0, 1, 2)
    private scrollingBgTile?: Phaser.GameObjects.TileSprite;
    private movingSprites: Phaser.GameObjects.Sprite[] = [];
    private spriteSpeed: number = ELF_SPEED_MIN;

    // Strobe effect for non-interactive slides
    private strobeEffect?: StrobeEffect;

    constructor() {
        super('Intro');
    }

    create(): void {
        this.currentSlide = 0;
        this.showSlide(0);
    }

    update(_time: number, delta: number): void {
        const slide = INTRO_SLIDES[this.currentSlide];

        if (slide.interactive && this.controller) {
            this.controller.update(delta);
            this.controller.ensureElfCount(2);
        }

        // Scroll background for animated slides
        if (this.scrollingBgTile) {
            this.scrollingBgTile.tilePositionY -= BG_SCROLL_SPEED * (delta / 1000);
        }

        // Move sprites upward and wrap around
        this.movingSprites.forEach(sprite => {
            sprite.y -= this.spriteSpeed * (delta / 1000);
            // Wrap around when off top of screen
            if (sprite.y < -SPRITE_OFF_SCREEN_OFFSET) {
                sprite.y = GAME_HEIGHT + SPRITE_OFF_SCREEN_OFFSET;
            }
        });

        // Update strobe effect
        this.strobeEffect?.update(delta);
    }

    private showSlide(index: number): void {
        // Clear previous slide
        this.clearSlide();

        const slide = INTRO_SLIDES[index];

        // Setup background visuals FIRST (so strobe is behind text)
        this.setupSlideVisuals(index);

        // Title (on top of visuals)
        const title = this.add.text(CENTRE_X, INTRO_LAYOUT.TITLE_Y, slide.title, TEXT_STYLES.INTRO_TITLE).setOrigin(0.5);
        this.slideElements.push(title);

        // Body text (on top of visuals)
        slide.lines.forEach((line, i) => {
            const text = this.add.text(CENTRE_X, INTRO_LAYOUT.BODY_START_Y + (i * INTRO_LAYOUT.BODY_LINE_HEIGHT), line, TEXT_STYLES.INTRO_BODY).setOrigin(0.5);
            this.slideElements.push(text);
        });

        // Skip button
        const skip = this.add.text(GAME_WIDTH - INTRO_LAYOUT.SKIP_MARGIN, INTRO_LAYOUT.SKIP_MARGIN, 'SKIP', TEXT_STYLES.INTRO_SKIP)
            .setOrigin(1, 0)
            .setInteractive();
        skip.on('pointerdown', () => this.scene.start('Game'));
        this.slideElements.push(skip);

        // Continue prompt (different for interactive slide)
        if (!slide.interactive) {
            const continueText = this.add.text(CENTRE_X, GAME_HEIGHT - 20, 'TAP TO CONTINUE', TEXT_STYLES.INTRO_CONTINUE)
                .setOrigin(0.5);
            this.slideElements.push(continueText);

            createBlinkingTween(this, continueText);

            // Tap anywhere to advance (delayed to prevent event propagation issues)
            this.time.delayedCall(UI_ANIMATION.INPUT_DELAY, () => {
                this.input.once('pointerdown', () => this.nextSlide());
            });
        } else {
            // Interactive slide - tap text area to continue
            const continueText = this.add.text(CENTRE_X, INTRO_LAYOUT.CONTINUE_Y, 'TAP HERE TO CONTINUE', TEXT_STYLES.INTRO_CONTINUE_INTERACTIVE)
                .setOrigin(0.5)
                .setInteractive();
            this.slideElements.push(continueText);

            createBlinkingTween(this, continueText, UI_ANIMATION.BLINK_ALPHA_INTERACTIVE);

            continueText.on('pointerdown', () => this.nextSlide());
        }
    }

    private setupSlideVisuals(index: number): void {
        // Add scrolling background for all slides
        this.scrollingBgTile = this.add.tileSprite(
            CENTRE_X,
            GAME_HEIGHT / 2,
            GAME_WIDTH,
            GAME_HEIGHT,
            'bg_tile'
        );
        this.slideElements.push(this.scrollingBgTile);

        switch (index) {
            case 0:
                // Multiple elves with snow - moving upward
                INTRO_LAYOUT.ELF_POSITIONS_SLIDE_0.forEach(pos => {
                    const elf = this.add.sprite(pos.x, pos.y, 'elf_snow');
                    elf.setScale(SCALE_FACTOR);
                    elf.play('elf_snow_walk');
                    this.slideElements.push(elf);
                    this.movingSprites.push(elf);
                });
                break;

            case 1:
                // Rudolph in pursuit mode chasing an elf
                // Add an elf being chased
                const chasedElf = this.add.sprite(CENTRE_X, INTRO_LAYOUT.PURSUIT_ELF_Y, 'elf_snow');
                chasedElf.setScale(SCALE_FACTOR);
                chasedElf.play('elf_snow_walk');
                this.slideElements.push(chasedElf);
                this.movingSprites.push(chasedElf);

                // Rudolph following behind
                const rudolph = this.add.sprite(CENTRE_X, INTRO_LAYOUT.PURSUIT_RUDOLPH_Y, 'rudolph_pursuit');
                rudolph.setScale(SCALE_FACTOR);
                rudolph.play('rudolph_pursuit_walk');
                this.slideElements.push(rudolph);
                this.movingSprites.push(rudolph);

                // Strobe effect using full-screen height
                this.strobeEffect = new StrobeEffect(this, { height: GAME_HEIGHT, startVisible: true });
                this.slideElements.push(this.strobeEffect.getOverlay());
                break;

            case 2:
                // Interactive demo - use GameplayController
                this.setupInteractiveDemo();
                break;

            case 3:
                // Innocent elves - moving upward
                INTRO_LAYOUT.ELF_POSITIONS_SLIDE_3.forEach(e => {
                    const elf = this.add.sprite(e.x, e.y, e.type);
                    elf.setScale(SCALE_FACTOR);
                    elf.play(`${e.type}_walk`);
                    this.slideElements.push(elf);
                    this.movingSprites.push(elf);
                });
                break;
        }
    }

    private setupInteractiveDemo(): void {
        // Background is already created by setupSlideVisuals (scrollingBgTile)

        // Create controller for interactive demo
        this.controller = new GameplayController({
            scene: this,
            onArrest: () => {}, // No scoring in demo
            onEscape: () => {},
            elfTypePool: [ElfTypes.SNOW], // Only snow elves
            maxElves: 2,
            spawnInterval: 0, // Don't use timer, use ensureElfCount instead
            showStrobe: true,
            bgScrollSpeed: BG_SCROLL_SPEED,
            showBackground: false // We handle background separately for full-screen coverage
        });
        this.controller.create();

        // Track controller's game objects for cleanup
        this.controller.getGameObjects().forEach(obj => {
            this.slideElements.push(obj);
        });

        // Spawn initial elves
        this.controller.ensureElfCount(2);
    }

    private clearSlide(): void {
        this.slideElements.forEach(el => el.destroy());
        this.slideElements = [];
        this.movingSprites = [];
        this.controller = undefined;
        this.scrollingBgTile = undefined;
        this.strobeEffect = undefined;
        this.input.removeAllListeners('pointerdown');
    }

    private nextSlide(): void {
        this.currentSlide++;
        if (this.currentSlide >= INTRO_SLIDES.length) {
            this.scene.start('Game');
        } else {
            this.showSlide(this.currentSlide);
        }
    }
}
