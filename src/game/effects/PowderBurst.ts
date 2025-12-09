import { Scene } from 'phaser';
import { SCALE_FACTOR } from '../data/dimensions';

export interface PowderBurstConfig {
    x: number;
    y: number;
    /** Number of particles (default 30) */
    count?: number;
    /** How far particles spread (default 80) */
    spread?: number;
    /** Particle lifespan in ms (default 800) */
    lifespan?: number;
}

/**
 * Creates a burst of white particles at the specified position.
 * Particles explode outward and fade out.
 */
export function createPowderBurst(scene: Scene, config: PowderBurstConfig): void {
    const {
        x,
        y,
        count = 30,
        spread = 80 * SCALE_FACTOR,
        lifespan = 800
    } = config;

    const emitter = scene.add.particles(x, y, 'particle_white', {
        speed: { min: spread * 0.3, max: spread },
        angle: { min: 0, max: 360 },
        scale: { start: 1.5, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: lifespan,
        gravityY: 150 * SCALE_FACTOR,
        emitting: false
    });

    // Set high depth so particles appear above other game objects
    emitter.setDepth(100);

    // Emit particles
    emitter.explode(count);

    // Clean up after particles die
    scene.time.delayedCall(lifespan + 100, () => {
        emitter.destroy();
    });
}
