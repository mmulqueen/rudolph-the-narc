// Scale factor for higher resolution rendering
// 1 = native (224x350), 2 = 2x (448x700), etc.
export const SCALE_FACTOR = 2;

// Game dimensions (scaled)
// Width = 7 lanes × 32px = 224px
export const GAME_WIDTH = 224 * SCALE_FACTOR;
export const GAME_HEIGHT = 350 * SCALE_FACTOR;
export const CONTROL_HEIGHT = 41 * SCALE_FACTOR;
export const PLAYABLE_HEIGHT = GAME_HEIGHT - CONTROL_HEIGHT;
export const CENTRE_X = GAME_WIDTH / 2;

// Lane system (scaled)
export const LANE_WIDTH = 32 * SCALE_FACTOR;
export const LANE_COUNT = 7;

// Sprite dimensions (original asset size - NOT scaled)
// Sprites are scaled at render time via setScale()
export const SPRITE_WIDTH = 32;
export const ELF_SPRITE_HEIGHT = 40;
export const RUDOLPH_SPRITE_HEIGHT = 53;
export const SPRITE_OFF_SCREEN_OFFSET = 32 * SCALE_FACTOR;

// Rudolph positioning
export const RUDOLPH_START_LANE = 3;
export const RUDOLPH_Y_OFFSET = 40 * SCALE_FACTOR;

// Helper to get lane centre X position
export const getLaneX = (lane: number): number => {
    return (lane * LANE_WIDTH) + (LANE_WIDTH / 2);
};
