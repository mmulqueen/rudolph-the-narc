// Scoring
export const SCORE_CONTRABAND = 10;  // +10 for arresting elf with snow
export const SCORE_WRONGFUL = -2;    // -2 for arresting innocent elf
export const SCORE_ESCAPE = -5;      // -5 when elf with snow escapes

// Win/lose thresholds
export const SCORE_WIN_THRESHOLD = 100;
export const SCORE_LOSE_THRESHOLD = -20;

// Elf types
export const ElfTypes = {
    SNOW: 'snow',
    TEDDY: 'teddy',
    CANDY: 'candy',
    COAL: 'coal',
    NOTHING: 'nothing'
} as const;

export type ElfType = typeof ElfTypes[keyof typeof ElfTypes];
