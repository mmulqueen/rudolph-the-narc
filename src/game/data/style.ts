import { SCALE_FACTOR } from './dimensions';

// UI Colours
export const COLOURS = {
    BUTTON_GREEN: 0x228822,
    BUTTON_GREEN_HOVER: 0x33aa33,
    BUTTON_RED: 0x880000,
    BUTTON_RED_HOVER: 0xaa0000,
    CONTROL_BG: 0x333333,
    PLAY_BUTTON: 0x228822,
    PLAY_BUTTON_HOVER: 0x33aa33,
    HOWTO_BUTTON: 0x228822,
    HOWTO_BUTTON_HOVER: 0x33aa33,
    STROBE_RED: 0xff0000,
    STROBE_BLUE: 0x0000ff,
    STROBE_ALPHA: 0.2,
    GAME_OVER_BG: 0x8b0000,
    FLASH_BG: 0x000000,
    FLASH_BG_ALPHA: 0.8,
} as const;

// Typography
export const FONT_FAMILY = '"Luckiest Guy", cursive';

// Helper to create scaled font size
const scaledFontSize = (basePx: number): string => `${basePx * SCALE_FACTOR}px`;

// Text styles
export const TEXT_STYLES = {
    TITLE: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(24),
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 4 * SCALE_FACTOR
    },
    GAME_OVER_TITLE: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(28),
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4 * SCALE_FACTOR
    },
    SCORE: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(14),
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2 * SCALE_FACTOR
    },
    FLASH_HEADER: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(16),
        stroke: '#000000',
        strokeThickness: 2 * SCALE_FACTOR,
        align: 'center'
    },
    FLASH_MESSAGE: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(9),
        color: '#ffffff',
        align: 'center'
    },
    BUTTON: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(24),
        color: '#ffffff'
    },
    BUTTON_SMALL: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(12),
        color: '#ffffff'
    },
    // Intro slide styles
    INTRO_TITLE: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(16),
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 3 * SCALE_FACTOR,
        align: 'center'
    },
    INTRO_BODY: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(10),
        color: '#ffffff',
        align: 'center'
    },
    INTRO_SKIP: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(10),
        color: '#ffffff'
    },
    INTRO_CONTINUE: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(12),
        color: '#ffffff'
    },
    INTRO_CONTINUE_INTERACTIVE: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(10),
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 8 * SCALE_FACTOR, y: 4 * SCALE_FACTOR }
    },
    // GameOver styles
    FINAL_SCORE: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(24),
        color: '#ffffff'
    },
    RESTART_PROMPT: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(16),
        color: '#ffffff'
    },
    // MainMenu styles
    TAGLINE: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(12),
        color: '#ffffff',
        align: 'center'
    },
    MENU_BUTTON_PLAY: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(18),
        color: '#ffffff'
    },
    MENU_BUTTON_HOWTO: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(14),
        color: '#ffffff'
    },
    MENU_QR_LINK: {
        fontFamily: FONT_FAMILY,
        fontSize: scaledFontSize(10),
        color: '#ffffff'
    },
} as const;
