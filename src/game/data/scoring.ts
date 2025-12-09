// Scoring
export const SCORE_CONTRABAND = 10;  // +10 for arresting elf with snow
export const SCORE_WRONGFUL = -2;    // -2 for arresting innocent elf
export const SCORE_ESCAPE = -5;      // -5 when elf with snow escapes
export const SANTA_SCORE_MULTIPLIER = 2;  // Santa events have doubled scores

// Win/lose thresholds
export const SCORE_WIN_THRESHOLD = 100;
export const SCORE_LOSE_THRESHOLD = -20;

// Santa spawn threshold
export const SANTA_SPAWN_THRESHOLD = 50;

// Elf types (includes Santa variants) - values are sprite keys
export const ElfTypes = {
    SNOW: 'elf_snow',
    TEDDY: 'elf_teddy',
    CANDY: 'elf_candy',
    COAL: 'elf_coal',
    NOTHING: 'elf_nothing',
    SANTA_SNOW: 'santa_snow',
    SANTA_NOTHING: 'santa_nothing'
} as const;

export type ElfType = typeof ElfTypes[keyof typeof ElfTypes];

// Helper to check if a type is a Santa variant
export const isSantaType = (type: ElfType): boolean => {
    return type.startsWith('santa_');
};

// Helper to check if a type is contraband (snow)
export const isContrabandType = (type: ElfType): boolean => {
    return type === ElfTypes.SNOW || type === ElfTypes.SANTA_SNOW;
};

// Terminal event generated when an elf is caught or escapes
export interface ElfTerminalEvent {
    header: string;
    message: string;
    scoreDelta: number;
}
