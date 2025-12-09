import { Scene, GameObjects } from 'phaser';
import { TEXT_STYLES } from '../data/style';
import { ref, Ref } from '../../refs';

export interface ButtonConfig {
    scene: Scene;
    x: number;
    y: number;
    width: number;
    height: number;
    colour: number;
    hoverColour?: number;
    label?: string;
    labelStyle?: Phaser.Types.GameObjects.Text.TextStyle;
    /** Icon texture key (used instead of label if provided) */
    icon?: string;
    /** Icon display size (defaults to height * 0.6) */
    iconSize?: number;
    onClick?: () => void;
    /** Called when button is pressed down */
    onPress?: () => void;
    /** Called when pointer/touch is released anywhere (for hold buttons) */
    onRelease?: () => void;
    onPointerOut?: () => void;
}

export interface ButtonObjects {
    rect: GameObjects.Rectangle;
    text?: GameObjects.Text;
    icon?: GameObjects.Image;
    isPressed: Ref<boolean>;
}

export function createButton(config: ButtonConfig): ButtonObjects {
    const {
        scene,
        x,
        y,
        width,
        height,
        colour,
        hoverColour,
        label,
        labelStyle,
        icon,
        iconSize,
        onClick,
        onPress,
        onRelease,
        onPointerOut,
    } = config;

    const rect = scene.add.rectangle(x, y, width, height, colour).setInteractive();

    let text: GameObjects.Text | undefined;
    let iconImage: GameObjects.Image | undefined;

    if (icon) {
        const size = iconSize ?? height * 0.6;
        iconImage = scene.add.image(x, y, icon).setDisplaySize(size, size);
    } else if (label) {
        const style = labelStyle ?? TEXT_STYLES.BUTTON;
        text = scene.add.text(x, y, label, style).setOrigin(0.5);
    }

    if (hoverColour !== undefined) {
        rect.on('pointerover', () => rect.setFillStyle(hoverColour));
        rect.on('pointerout', () => {
            rect.setFillStyle(colour);
            onPointerOut?.();
        });
    } else if (onPointerOut) {
        rect.on('pointerout', onPointerOut);
    }

    const isPressed = ref(false);

    rect.on('pointerdown', () => {
        isPressed.value = true;
        if (onClick) {
            onClick();
        } else {
            onPress?.();
        }
    });

    scene.input.on('pointerup', () => {
        if (isPressed.value) {
            isPressed.value = false;
            onRelease?.();
        }
    });

    return { rect, text, icon: iconImage, isPressed };
}
