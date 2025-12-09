import { Scene, GameObjects, Tweens } from 'phaser';
import { UI_ANIMATION } from '../data/ui';

export function createBlinkingTween(
    scene: Scene,
    target: GameObjects.Text,
    alpha: number = UI_ANIMATION.BLINK_ALPHA_LOW,
    duration: number = UI_ANIMATION.BLINK_DURATION
): Tweens.Tween {
    return scene.tweens.add({
        targets: target,
        alpha,
        duration,
        yoyo: true,
        repeat: -1
    });
}
