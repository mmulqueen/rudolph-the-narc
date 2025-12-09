import { Scene } from 'phaser';
import { CENTRE_X, GAME_WIDTH, GAME_HEIGHT, SCALE_FACTOR } from '../data/dimensions';
import { COLOURS, TEXT_STYLES } from '../data/style';
import { MENU_LAYOUT } from '../data/ui';
import { createButton } from '../ui/Button';
import { createPowderBurst } from '../effects/PowderBurst';

export class MainMenu extends Scene {
    private qrPopupElements: Phaser.GameObjects.GameObject[] = [];

    constructor() {
        super('MainMenu');
    }

    create() {
        // Title
        this.add.text(CENTRE_X, MENU_LAYOUT.TITLE_Y, 'RUDOLPH\nTHE NARC', {
            ...TEXT_STYLES.TITLE,
            align: 'center'
        }).setOrigin(0.5);

        // Animated Rudolph preview (50% larger than in-game, pursuit variant)
        const rudolph = this.add.sprite(CENTRE_X, MENU_LAYOUT.RUDOLPH_PREVIEW_Y, 'rudolph_pursuit');
        rudolph.setScale(SCALE_FACTOR * 1.5);
        rudolph.play('rudolph_pursuit_walk');

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
            onClick: () => {
                createPowderBurst(this, {
                    x: CENTRE_X,
                    y: MENU_LAYOUT.PLAY_BUTTON_Y,
                    count: 40,
                    spread: 120 * SCALE_FACTOR
                });
                this.time.delayedCall(300, () => this.scene.start('Game'));
            }
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

        // GitHub icon (small, discreet, top-left)
        const iconSize = 16 * SCALE_FACTOR;
        const githubIcon = this.add.image(MENU_LAYOUT.QR_MARGIN + iconSize / 2, MENU_LAYOUT.QR_MARGIN + iconSize / 2, 'icon_github')
            .setDisplaySize(iconSize, iconSize)
            .setAlpha(0.5)
            .setInteractive();
        githubIcon.on('pointerdown', () => {
            window.open('https://github.com/mmulqueen/rudolph-the-narc', '_blank');
        });

        // QR code icon (small, discreet, top-right)
        const qrIcon = this.add.image(GAME_WIDTH - MENU_LAYOUT.QR_MARGIN - iconSize / 2, MENU_LAYOUT.QR_MARGIN + iconSize / 2, 'icon_qrcode')
            .setDisplaySize(iconSize, iconSize)
            .setAlpha(0.5)
            .setInteractive();
        qrIcon.on('pointerdown', () => this.showQRPopup());

        // Keyboard shortcuts
        this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('Game'));
        this.input.keyboard?.once('keydown-H', () => this.scene.start('Intro'));
    }

    private async showQRPopup(): Promise<void> {
        // Don't show if already visible
        if (this.qrPopupElements.length > 0) return;

        const url = window.location.href;

        // Dynamically import qrcode library
        const QRCode = await import('qrcode');

        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(url, {
            width: MENU_LAYOUT.QR_POPUP_SIZE,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        // Create dark overlay
        const overlay = this.add.rectangle(CENTRE_X, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8)
            .setInteractive();
        overlay.on('pointerdown', () => this.hideQRPopup());
        this.qrPopupElements.push(overlay);

        // Load and display QR code image
        const textureKey = 'qr_code_' + Date.now();
        this.textures.addBase64(textureKey, qrDataUrl);

        // Wait for texture to load
        this.textures.once('addtexture', () => {
            const qrImage = this.add.image(CENTRE_X, GAME_HEIGHT / 2, textureKey);
            this.qrPopupElements.push(qrImage);

            // Add "Tap to close" text
            const closeText = this.add.text(CENTRE_X, GAME_HEIGHT / 2 + MENU_LAYOUT.QR_POPUP_SIZE / 2 + 20 * SCALE_FACTOR, 'TAP TO CLOSE', TEXT_STYLES.MENU_QR_LINK)
                .setOrigin(0.5);
            this.qrPopupElements.push(closeText);
        });
    }

    private hideQRPopup(): void {
        this.qrPopupElements.forEach(el => el.destroy());
        this.qrPopupElements = [];
    }
}
