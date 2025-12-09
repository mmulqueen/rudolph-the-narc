import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Minimal boot - no assets needed before preloader
    }

    create() {
        this.scene.start('Preloader');
    }
}
