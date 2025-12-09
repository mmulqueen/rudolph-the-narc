// Game dimensions
export const GAME_WIDTH = 256;
export const GAME_HEIGHT = 396;
export const PLAYABLE_HEIGHT = 355;
export const CONTROL_HEIGHT = 41;
export const CENTRE_X = GAME_WIDTH / 2;

// Lane system
export const LANE_WIDTH = 32;
export const LANE_COUNT = 8;

// Sprite dimensions
export const SPRITE_WIDTH = 32;
export const SPRITE_HEIGHT = 64;
export const SPRITE_OFF_SCREEN_OFFSET = 32;

// Helper to get lane centre X position
export const getLaneX = (lane: number): number => {
    return (lane * LANE_WIDTH) + (LANE_WIDTH / 2);
};
