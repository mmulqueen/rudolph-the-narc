// UI Colours
export const COLOURS = {
    BUTTON_GREY: 0x555555,
    BUTTON_RED: 0x880000,
    CONTROL_BG: 0x333333,
    PLAY_BUTTON: 0x228822,
    PLAY_BUTTON_HOVER: 0x33aa33,
    HOWTO_BUTTON: 0x444488,
    HOWTO_BUTTON_HOVER: 0x5555aa,
    STROBE_RED: 0xff0000,
    STROBE_BLUE: 0x0000ff,
    STROBE_ALPHA: 0.2,
    GAME_OVER_BG: 0x8b0000,
    FLASH_BG: 0x000000,
    FLASH_BG_ALPHA: 0.8,
} as const;

// Typography
export const FONT_FAMILY = 'Arial Black';

// Text styles
export const TEXT_STYLES = {
    TITLE: {
        fontFamily: FONT_FAMILY,
        fontSize: '24px',
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 4
    },
    GAME_OVER_TITLE: {
        fontFamily: FONT_FAMILY,
        fontSize: '28px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    },
    SCORE: {
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
    },
    FLASH_HEADER: {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center'
    },
    FLASH_MESSAGE: {
        fontFamily: FONT_FAMILY,
        fontSize: '9px',
        color: '#ffffff',
        align: 'center'
    },
    BUTTON: {
        fontFamily: FONT_FAMILY,
        fontSize: '24px',
        color: '#ffffff'
    },
    BUTTON_SMALL: {
        fontFamily: FONT_FAMILY,
        fontSize: '12px',
        color: '#ffffff'
    },
    // Intro slide styles
    INTRO_TITLE: {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center'
    },
    INTRO_BODY: {
        fontFamily: FONT_FAMILY,
        fontSize: '10px',
        color: '#ffffff',
        align: 'center'
    },
    INTRO_SKIP: {
        fontFamily: FONT_FAMILY,
        fontSize: '10px',
        color: '#888888'
    },
    INTRO_CONTINUE: {
        fontFamily: FONT_FAMILY,
        fontSize: '12px',
        color: '#ffff00'
    },
    INTRO_CONTINUE_INTERACTIVE: {
        fontFamily: FONT_FAMILY,
        fontSize: '10px',
        color: '#ffff00',
        backgroundColor: '#333333',
        padding: { x: 8, y: 4 }
    },
    // GameOver styles
    FINAL_SCORE: {
        fontFamily: FONT_FAMILY,
        fontSize: '24px',
        color: '#ffff00'
    },
    RESTART_PROMPT: {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color: '#ffffff'
    },
    // MainMenu styles
    TAGLINE: {
        fontFamily: FONT_FAMILY,
        fontSize: '12px',
        color: '#aaaaaa',
        align: 'center'
    },
    MENU_BUTTON_PLAY: {
        fontFamily: FONT_FAMILY,
        fontSize: '18px',
        color: '#ffffff'
    },
    MENU_BUTTON_HOWTO: {
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
        color: '#ffffff'
    },
} as const;
