import { SCALE_FACTOR } from './dimensions';

// Animation config
export const ANIMATION_FRAME_RATE = 4;
export const ANIMATION_REPEAT = -1;

// Timing (milliseconds - not scaled)
export const STROBE_INTERVAL_MS = 100;
export const FLASH_MESSAGE_HOLD_MS = 1500;
export const FLASH_MESSAGE_FADE_MS = 500;

// Movement speeds (pixels per second - scaled)
export const BG_SCROLL_SPEED = 50 * SCALE_FACTOR;

// Elf movement (speeds scaled to match larger distances)
export const ELF_SPEED_MIN = 80 * SCALE_FACTOR;
export const ELF_SPEED_MAX = 150 * SCALE_FACTOR;
export const ELF_SPAWN_INTERVAL_MS = 1500;
