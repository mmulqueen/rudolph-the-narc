import { Scene } from 'phaser';
import { CENTRE_X, GAME_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT } from '../data/dimensions';
import { ANIMATION_FRAME_RATE, ANIMATION_REPEAT } from '../data/movement';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        const centreY = GAME_HEIGHT / 2;

        // Progress bar outline
        this.add.rectangle(CENTRE_X, centreY, 200, 20).setStrokeStyle(1, 0xffffff);

        // Progress bar fill
        const bar = this.add.rectangle(CENTRE_X - 95, centreY, 4, 16, 0xffffff);

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (190 * progress);
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
