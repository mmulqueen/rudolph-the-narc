// UI Layout Constants

// MainMenu layout
export const MENU_LAYOUT = {
    TITLE_Y: 60,
    RUDOLPH_PREVIEW_Y: 160,
    TAGLINE_Y: 230,
    PLAY_BUTTON_Y: 290,
    HOWTO_BUTTON_Y: 345,
    BUTTON_WIDTH: 140,
    BUTTON_HEIGHT: 40,
} as const;

// GameOver layout
export const GAME_OVER_LAYOUT = {
    TITLE_Y: 150,
    SCORE_Y: 250,
    RESTART_PROMPT_Y: 380,
} as const;

// Intro layout
export const INTRO_LAYOUT = {
    TITLE_Y: 40,
    BODY_START_Y: 100,
    BODY_LINE_HEIGHT: 14,
    SKIP_MARGIN: 8,
    CONTINUE_Y: 250,
    ELF_POSITIONS_SLIDE_0: [
        { x: 40, y: 320 },
        { x: 100, y: 400 },
        { x: 160, y: 280 },
        { x: 216, y: 360 }
    ],
    ELF_POSITIONS_SLIDE_3: [
        { type: 'elf_teddy', x: 32, y: 320 },
        { type: 'elf_candy', x: 96, y: 380 },
        { type: 'elf_coal', x: 160, y: 290 },
        { type: 'elf_nothing', x: 224, y: 350 }
    ],
    PURSUIT_ELF_Y: 280,
    PURSUIT_RUDOLPH_Y: 340,
} as const;

// Common UI values
export const UI_COMMON = {
    SCORE_X: 8,
    SCORE_Y: 8,
    TEXT_PADDING: 8,
} as const;

// Animation timing
export const UI_ANIMATION = {
    BLINK_DURATION: 500,
    BLINK_ALPHA_LOW: 0.3,
    BLINK_ALPHA_INTERACTIVE: 0.5,
    INPUT_DELAY: 100,
} as const;
