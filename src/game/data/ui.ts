import { SCALE_FACTOR } from './dimensions';

// UI Layout Constants

// MainMenu layout
export const MENU_LAYOUT = {
    TITLE_Y: 60 * SCALE_FACTOR,
    RUDOLPH_PREVIEW_Y: 160 * SCALE_FACTOR,
    TAGLINE_Y: 230 * SCALE_FACTOR,
    PLAY_BUTTON_Y: 290 * SCALE_FACTOR,
    HOWTO_BUTTON_Y: 345 * SCALE_FACTOR,
    BUTTON_WIDTH: 140 * SCALE_FACTOR,
    BUTTON_HEIGHT: 40 * SCALE_FACTOR,
} as const;

// GameOver layout
export const GAME_OVER_LAYOUT = {
    TITLE_Y: 150 * SCALE_FACTOR,
    SCORE_Y: 250 * SCALE_FACTOR,
    RESTART_PROMPT_Y: 380 * SCALE_FACTOR,
} as const;

// Intro layout
export const INTRO_LAYOUT = {
    TITLE_Y: 40 * SCALE_FACTOR,
    BODY_START_Y: 100 * SCALE_FACTOR,
    BODY_LINE_HEIGHT: 14 * SCALE_FACTOR,
    SKIP_MARGIN: 8 * SCALE_FACTOR,
    CONTINUE_Y: 250 * SCALE_FACTOR,
    ELF_POSITIONS_SLIDE_0: [
        { x: 40 * SCALE_FACTOR, y: 320 * SCALE_FACTOR },
        { x: 100 * SCALE_FACTOR, y: 400 * SCALE_FACTOR },
        { x: 160 * SCALE_FACTOR, y: 280 * SCALE_FACTOR },
        { x: 216 * SCALE_FACTOR, y: 360 * SCALE_FACTOR }
    ],
    ELF_POSITIONS_SLIDE_3: [
        { type: 'elf_teddy', x: 32 * SCALE_FACTOR, y: 320 * SCALE_FACTOR },
        { type: 'elf_candy', x: 96 * SCALE_FACTOR, y: 380 * SCALE_FACTOR },
        { type: 'elf_coal', x: 160 * SCALE_FACTOR, y: 290 * SCALE_FACTOR },
        { type: 'elf_nothing', x: 224 * SCALE_FACTOR, y: 350 * SCALE_FACTOR }
    ],
    PURSUIT_ELF_Y: 280 * SCALE_FACTOR,
    PURSUIT_RUDOLPH_Y: 340 * SCALE_FACTOR,
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
