import { SCALE_FACTOR, PLAYABLE_HEIGHT } from './dimensions';

// UI Layout Constants

// MainMenu layout
export const MENU_LAYOUT = {
    TITLE_Y: 50 * SCALE_FACTOR,
    RUDOLPH_PREVIEW_Y: 130 * SCALE_FACTOR,
    TAGLINE_Y: 195 * SCALE_FACTOR,
    PLAY_BUTTON_Y: 255 * SCALE_FACTOR,
    HOWTO_BUTTON_Y: 305 * SCALE_FACTOR,
    BUTTON_WIDTH: 140 * SCALE_FACTOR,
    BUTTON_HEIGHT: 40 * SCALE_FACTOR,
    QR_MARGIN: 8 * SCALE_FACTOR,
    QR_POPUP_SIZE: 180 * SCALE_FACTOR,
} as const;

// GameOver layout
export const GAME_OVER_LAYOUT = {
    TITLE_Y: 120 * SCALE_FACTOR,
    SCORE_Y: 180 * SCALE_FACTOR,
    RESTART_PROMPT_Y: 300 * SCALE_FACTOR,
} as const;

// Intro layout
export const INTRO_LAYOUT = {
    TITLE_Y: 40 * SCALE_FACTOR,
    BODY_START_Y: 100 * SCALE_FACTOR,
    BODY_LINE_HEIGHT: 14 * SCALE_FACTOR,
    SKIP_MARGIN: 8 * SCALE_FACTOR,
    CONTINUE_Y: PLAYABLE_HEIGHT - 20 * SCALE_FACTOR,
    OVERLAY_PADDING: 10 * SCALE_FACTOR,
    OVERLAY_ALPHA: 0.7,
    ELF_POSITIONS_SLIDE_0: [
        { x: 40 * SCALE_FACTOR, y: 280 * SCALE_FACTOR },
        { x: 100 * SCALE_FACTOR, y: 340 * SCALE_FACTOR },
        { x: 160 * SCALE_FACTOR, y: 260 * SCALE_FACTOR },
        { x: 200 * SCALE_FACTOR, y: 310 * SCALE_FACTOR }
    ],
    ELF_POSITIONS_SLIDE_3: [
        { type: 'elf_teddy', x: 32 * SCALE_FACTOR, y: 280 * SCALE_FACTOR },
        { type: 'elf_candy', x: 80 * SCALE_FACTOR, y: 330 * SCALE_FACTOR },
        { type: 'elf_coal', x: 144 * SCALE_FACTOR, y: 260 * SCALE_FACTOR },
        { type: 'elf_nothing', x: 192 * SCALE_FACTOR, y: 300 * SCALE_FACTOR }
    ],
    PURSUIT_ELF_Y: 250 * SCALE_FACTOR,
    PURSUIT_RUDOLPH_Y: 300 * SCALE_FACTOR,
} as const;

// Common UI values
export const UI_COMMON = {
    SCORE_X: 8 * SCALE_FACTOR,
    SCORE_Y: 8 * SCALE_FACTOR,
    TEXT_PADDING: 8 * SCALE_FACTOR,
} as const;

// Animation timing (not scaled - these are milliseconds/alpha values)
export const UI_ANIMATION = {
    BLINK_DURATION: 500,
    BLINK_ALPHA_LOW: 0.3,
    BLINK_ALPHA_INTERACTIVE: 0.5,
    INPUT_DELAY: 100,
} as const;

// Control buttons layout (in-game)
export const CONTROL_BUTTONS = {
    WIDTH: 60 * SCALE_FACTOR,
    HEIGHT: 36 * SCALE_FACTOR,
    GAP: 4 * SCALE_FACTOR,
} as const;

// Flash message layout
export const FLASH_MESSAGE_LAYOUT = {
    MARGIN: 20 * SCALE_FACTOR,
    HEIGHT: 70 * SCALE_FACTOR,
    STROKE_WIDTH: 2 * SCALE_FACTOR,
    HEADER_Y_OFFSET: -18 * SCALE_FACTOR,
    MESSAGE_Y_OFFSET: 12 * SCALE_FACTOR,
    TEXT_PADDING: 20 * SCALE_FACTOR,
} as const;
