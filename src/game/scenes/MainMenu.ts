import { Scene } from 'phaser';
import { CENTRE_X, SCALE_FACTOR } from '../data/dimensions';
import { COLOURS, TEXT_STYLES } from '../data/style';
import { MENU_LAYOUT } from '../data/ui';
import { createButton } from '../ui/Button';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Title
        this.add.text(CENTRE_X, MENU_LAYOUT.TITLE_Y, 'RUDOLPH\nTHE NARC', {
            ...TEXT_STYLES.TITLE,
            align: 'center'
        }).setOrigin(0.5);

        // Animated Rudolph preview
        const rudolph = this.add.sprite(CENTRE_X, MENU_LAYOUT.RUDOLPH_PREVIEW_Y, 'rudolph_patrol');
        rudolph.setScale(SCALE_FACTOR);
        rudolph.play('rudolph_patrol_walk');

        // Tagline
        this.add.text(CENTRE_X, MENU_LAYOUT.TAGLINE_Y, 'Save Christmas from\nthe snow menace!', TEXT_STYLES.TAGLINE).setOrigin(0.5);

        // PLAY button
        createButton({
            scene: this,
            x: CENTRE_X,
            y: MENU_LAYOUT.PLAY_BUTTON_Y,
            width: MENU_LAYOUT.BUTTON_WIDTH,
            height: MENU_LAYOUT.BUTTON_HEIGHT,
            colour: COLOURS.PLAY_BUTTON,
            hoverColour: COLOURS.PLAY_BUTTON_HOVER,
            label: 'PLAY',
            labelStyle: TEXT_STYLES.MENU_BUTTON_PLAY,
            onClick: () => this.scene.start('Game')
        });

        // HOW TO PLAY button
        createButton({
            scene: this,
            x: CENTRE_X,
            y: MENU_LAYOUT.HOWTO_BUTTON_Y,
            width: MENU_LAYOUT.BUTTON_WIDTH,
            height: MENU_LAYOUT.BUTTON_HEIGHT,
            colour: COLOURS.HOWTO_BUTTON,
            hoverColour: COLOURS.HOWTO_BUTTON_HOVER,
            label: 'HOW TO PLAY',
            labelStyle: TEXT_STYLES.MENU_BUTTON_HOWTO,
            onClick: () => this.scene.start('Intro')
        });

        // Keyboard shortcuts
        this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('Game'));
        this.input.keyboard?.once('keydown-H', () => this.scene.start('Intro'));
    }
}
