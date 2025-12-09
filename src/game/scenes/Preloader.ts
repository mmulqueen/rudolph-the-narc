import { Scene } from 'phaser';
import { CENTRE_X, GAME_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT, SCALE_FACTOR } from '../data/dimensions';
import { ANIMATION_FRAME_RATE, ANIMATION_REPEAT } from '../data/movement';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        const centreY = GAME_HEIGHT / 2;

        // Progress bar outline
        const barWidth = 200 * SCALE_FACTOR;
        const barHeight = 20 * SCALE_FACTOR;
        this.add.rectangle(CENTRE_X, centreY, barWidth, barHeight).setStrokeStyle(1 * SCALE_FACTOR, 0xffffff);

        // Progress bar fill
        const fillHeight = 16 * SCALE_FACTOR;
        const fillStartWidth = 4 * SCALE_FACTOR;
        const fillMaxWidth = (barWidth - 10 * SCALE_FACTOR);
        const bar = this.add.rectangle(CENTRE_X - (barWidth / 2) + (fillStartWidth / 2) + (5 * SCALE_FACTOR), centreY, fillStartWidth, fillHeight, 0xffffff);

        this.load.on('progress', (progress: number) => {
            bar.width = fillStartWidth + (fillMaxWidth * progress);
        });
    }

    preload() {
        const spriteConfig = { frameWidth: SPRITE_WIDTH, frameHeight: SPRITE_HEIGHT };

        // Load character spritesheets
        this.load.setPath('assets/sprites');
        this.load.spritesheet('rudolph_patrol', 'rudolph_on_patrol.png', spriteConfig);
        this.load.spritesheet('rudolph_pursuit', 'rudolph_in_pursuit.png', spriteConfig);
        this.load.spritesheet('elf_snow', 'elf_with_snow.png', spriteConfig);
        this.load.spritesheet('elf_teddy', 'elf_with_teddy.png', spriteConfig);
        this.load.spritesheet('elf_candy', 'elf_with_candy.png', spriteConfig);
        this.load.spritesheet('elf_coal', 'elf_with_coal.png', spriteConfig);
        this.load.spritesheet('elf_nothing', 'elf_with_nothing.png', spriteConfig);

        // Load background tile
        this.load.setPath('assets');
        this.load.image('bg_tile', 'bg_tile.png');
    }

    create() {
        // Create walking animations (2 frames each, looping)
        const sprites = [
            'rudolph_patrol',
            'rudolph_pursuit',
            'elf_snow',
            'elf_teddy',
            'elf_candy',
            'elf_coal',
            'elf_nothing'
        ];

        sprites.forEach(key => {
            this.anims.create({
                key: `${key}_walk`,
                frames: this.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
                frameRate: ANIMATION_FRAME_RATE,
                repeat: ANIMATION_REPEAT
            });
        });

        this.scene.start('MainMenu');
    }
}
