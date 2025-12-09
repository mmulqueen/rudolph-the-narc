import { Scene, Input, GameObjects } from 'phaser';
import { Rudolph } from '../entities/Rudolph';
import { Elf, createElf } from '../entities/Elf';
import { StrobeEffect } from '../effects/StrobeEffect';
import { createButton } from '../ui/Button';
import { Ref } from '../../refs';
import { GAME_WIDTH, CENTRE_X, PLAYABLE_HEIGHT, CONTROL_HEIGHT, LANE_COUNT } from '../data/dimensions';
import { ElfTypes, ElfType, isContrabandType, isSantaType, SANTA_SPAWN_THRESHOLD } from '../data/scoring';
import { HORIZONTAL_MOVEMENT_Y_GRACE } from "../data/movement";
import { COLOURS, TEXT_STYLES } from '../data/style';
import { CONTROL_BUTTONS } from '../data/ui';

// Time without snow spawn before forcing a snow spawn
const GUARANTEED_SNOW_INTERVAL_MS = 6000;

export interface GameplayControllerConfig {
    scene: Scene;
    bgScrollSpeed: number;
    onArrest?: (elf: Elf) => void;
    onEscape?: (elf: Elf) => void;
    elfTypePool?: ElfType[];
    getScore?: () => number;
    maxElves?: number;
    spawnInterval?: number;
    showStrobe?: boolean;
}

export class GameplayController {
    private scene: Scene;
    private config: GameplayControllerConfig;

    // State
    private rudolph!: Rudolph;
    private elves: Elf[] = [];
    private laneOccupied: boolean[] = [];
    private noseActive: boolean = false;
    private noseButtonPressed!: Ref<boolean>;

    // Input
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyA!: Input.Keyboard.Key;
    private keyD!: Input.Keyboard.Key;
    private keyS!: Input.Keyboard.Key;
    private keyW!: Input.Keyboard.Key;
    private key4!: Input.Keyboard.Key;
    private key5!: Input.Keyboard.Key;
    private key6!: Input.Keyboard.Key;
    private key8!: Input.Keyboard.Key;

    // Visuals
    private strobeEffect?: StrobeEffect;
    private bgTile!: GameObjects.TileSprite;

    // Spawning
    private spawnTimer: number = 0;
    private timeSinceLastSnow: number = 0;

    // Difficulty scaling (1.0 = normal, higher = harder)
    private difficultyMultiplier: number = 1.0;

    // Pending movement intent: -1 = left, 0 = none, 1 = right
    private pendingMove: -1 | 0 | 1 = 0;

    // Track all created game objects for cleanup
    private gameObjects: GameObjects.GameObject[] = [];

    constructor(config: GameplayControllerConfig) {
        this.scene = config.scene;
        this.config = {
            onArrest: () => {},
            onEscape: () => {},
            elfTypePool: [ElfTypes.SNOW],
            getScore: () => 0,
            maxElves: 0,
            spawnInterval: 0,
            showStrobe: true,
            ...config
        };
    }

    create(): void {
        this.elves = [];
        this.laneOccupied = new Array(LANE_COUNT).fill(false);
        this.noseActive = false;
        this.spawnTimer = 0;
        this.timeSinceLastSnow = 0;

        // Create background
        this.bgTile = this.scene.add.tileSprite(
            CENTRE_X,
            PLAYABLE_HEIGHT / 2,
            GAME_WIDTH,
            PLAYABLE_HEIGHT,
            'bg_tile'
        );
        this.trackObj(this.bgTile);

        // Create strobe effect (behind sprites, so created early)
        if (this.config.showStrobe) {
            this.strobeEffect = new StrobeEffect(this.scene);
            this.trackObj(this.strobeEffect.getOverlay());
        }

        // Create control area background
        const controlBg = this.scene.add.rectangle(
            CENTRE_X,
            PLAYABLE_HEIGHT + CONTROL_HEIGHT / 2,
            GAME_WIDTH,
            CONTROL_HEIGHT,
            COLOURS.CONTROL_BG
        );
        this.trackObj(controlBg);

        // Create Rudolph
        this.rudolph = new Rudolph(this.scene);
        this.trackObj(this.rudolph);

        // Create control buttons
        this.createControlButtons();

        // Setup keyboard input
        this.setupKeyboardInput();
    }

    update(delta: number): void {
        // Update background scroll (speed increases with difficulty)
        const scrollSpeed = this.config.bgScrollSpeed * this.difficultyMultiplier;
        this.bgTile.tilePositionY -= scrollSpeed * (delta / 1000);

        // Update strobe effect during pursuit
        if (this.noseActive && this.strobeEffect) {
            this.strobeEffect.update(delta);
        }

        // Update elves before handling input so collision check uses current positions
        this.updateElves(delta);

        // Try to execute pending move now that elves have moved
        this.tryExecutePendingMove();

        // Handle keyboard input (may set new pending move)
        this.handleKeyboardInput();

        // Check collisions
        this.checkCollisions();

        // Track time since last snow spawn
        this.timeSinceLastSnow += delta;

        // Timed spawning (interval decreases with difficulty)
        if (this.config.spawnInterval && this.config.spawnInterval > 0) {
            this.spawnTimer += delta;
            const adjustedInterval = this.config.spawnInterval / this.difficultyMultiplier;
            if (this.spawnTimer >= adjustedInterval) {
                this.spawnTimer = 0;
                this.spawnElf();
            }
        }
    }

    destroy(): void {
        this.gameObjects.forEach(obj => obj.destroy());
        this.gameObjects = [];
        this.elves = [];
    }

    // Public methods for external control
    ensureElfCount(count: number): void {
        while (this.elves.length < count) {
            this.spawnElf();
        }
    }

    spawnElf(type?: ElfType): void {
        const availableLanes: number[] = [];
        const rudolphLane = this.rudolph.getCurrentLane();

        for (let i = 0; i < LANE_COUNT; i++) {
            if (!this.laneOccupied[i] && i !== rudolphLane) {
                availableLanes.push(i);
            }
        }

        if (availableLanes.length === 0) return;

        const lane = Phaser.Math.RND.pick(availableLanes);
        const elfType = type ?? Phaser.Math.RND.pick(this.getAvailableElfTypes());
        const elf = createElf(this.scene, lane, elfType, this.difficultyMultiplier);
        this.elves.push(elf);
        this.laneOccupied[lane] = true;
        this.trackObj(elf);

        // Reset snow timer if we spawned contraband
        if (isContrabandType(elfType)) {
            this.timeSinceLastSnow = 0;
        }
    }

    private getAvailableElfTypes(): ElfType[] {
        const pool = this.config.elfTypePool!;

        const score = this.config.getScore!();
        const santaAlreadyActive = this.elves.some(e => e.isSanta);
        const santaAllowed = score >= SANTA_SPAWN_THRESHOLD && !santaAlreadyActive;
        const forceContraband = this.timeSinceLastSnow >= GUARANTEED_SNOW_INTERVAL_MS;

        return pool.filter(type =>
            (santaAllowed || !isSantaType(type)) &&
            (!forceContraband || isContrabandType(type))
        );
    }

    setDifficulty(multiplier: number): void {
        if (multiplier === this.difficultyMultiplier) return;
        this.difficultyMultiplier = multiplier;
        // Update Rudolph's animation speed to match new scroll speed
        const scrollSpeed = this.config.bgScrollSpeed * this.difficultyMultiplier;
        this.rudolph.setAnimationSpeed(scrollSpeed);
    }

    moveLeft(): void {
        this.pendingMove = -1;
        this.tryExecutePendingMove();
    }

    moveRight(): void {
        this.pendingMove = 1;
        this.tryExecutePendingMove();
    }

    private tryExecutePendingMove(): void {
        if (this.pendingMove === 0) return;

        const targetLane = this.rudolph.getCurrentLane() + this.pendingMove;
        if (targetLane < 0 || targetLane >= LANE_COUNT) {
            this.pendingMove = 0;
            return;
        }

        if (!this.wouldCollide(targetLane)) {
            if (this.pendingMove === -1) {
                this.rudolph.moveLeft();
            } else {
                this.rudolph.moveRight();
            }
            this.pendingMove = 0;
        }
    }

    private wouldCollide(lane: number): boolean {
        const rudolphTop = this.rudolph.getBounds().top;
        // Can't move into lane if there's an elf that hasn't passed Rudolph yet
        return this.elves.some(elf => {
            if (elf.lane !== lane) return false;
            const elfBottom = elf.getBounds().bottom - HORIZONTAL_MOVEMENT_Y_GRACE;
            return elfBottom >= rudolphTop;
        });
    }

    activateNose(): void {
        if (this.noseActive) return;
        this.noseActive = true;
        this.rudolph.activatePursuit();
        this.stopElfInLane(this.rudolph.getCurrentLane());
        this.strobeEffect?.show();
    }

    deactivateNose(): void {
        if (!this.noseActive) return;
        this.noseActive = false;
        this.rudolph.deactivatePursuit();
        this.resumeAllElves();
        this.strobeEffect?.hide();
    }

    getRudolph(): Rudolph {
        return this.rudolph;
    }

    getElves(): Elf[] {
        return this.elves;
    }

    isNoseActive(): boolean {
        return this.noseActive;
    }

    getGameObjects(): GameObjects.GameObject[] {
        return this.gameObjects;
    }

    // Private methods
    private trackObj(...objs: GameObjects.GameObject[]): void {
        this.gameObjects.push(...objs);
    }

    private untrackObj(obj: GameObjects.GameObject): void {
        const index = this.gameObjects.indexOf(obj);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
        }
    }

    private setupKeyboardInput(): void {
        if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            this.keyA = this.scene.input.keyboard.addKey('A');
            this.keyD = this.scene.input.keyboard.addKey('D');
            this.keyS = this.scene.input.keyboard.addKey('S');
            this.keyW = this.scene.input.keyboard.addKey('W');
            this.key4 = this.scene.input.keyboard.addKey('FOUR');
            this.key5 = this.scene.input.keyboard.addKey('FIVE');
            this.key6 = this.scene.input.keyboard.addKey('SIX');
            this.key8 = this.scene.input.keyboard.addKey('EIGHT');
        }
    }

    private handleKeyboardInput(): void {
        // Movement (single step on key press)
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
            Phaser.Input.Keyboard.JustDown(this.keyA) ||
            Phaser.Input.Keyboard.JustDown(this.key4)) {
            this.moveLeft();
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
            Phaser.Input.Keyboard.JustDown(this.keyD) ||
            Phaser.Input.Keyboard.JustDown(this.key6)) {
            this.moveRight();
        }

        // Nose activation (hold) - combine keyboard and button input
        const noseKeyPressed =
            this.cursors.up?.isDown ||
            this.cursors.down?.isDown ||
            this.cursors.space?.isDown ||
            this.keyS?.isDown ||
            this.keyW?.isDown ||
            this.key5?.isDown ||
            this.key8?.isDown;

        const wantsNoseActive = noseKeyPressed || this.noseButtonPressed.value;

        if (wantsNoseActive && !this.noseActive) {
            this.activateNose();
        } else if (!wantsNoseActive && this.noseActive) {
            this.deactivateNose();
        }
    }

    private createControlButtons(): void {
        const buttonY = PLAYABLE_HEIGHT + CONTROL_HEIGHT / 2;
        const buttonHeight = CONTROL_BUTTONS.HEIGHT;
        const buttonWidth = CONTROL_BUTTONS.WIDTH;
        const gap = CONTROL_BUTTONS.GAP;
        const totalWidth = (buttonWidth * 3) + (gap * 2);
        const startX = (GAME_WIDTH - totalWidth) / 2 + buttonWidth / 2;

        // Left button
        const leftBtn = createButton({
            scene: this.scene,
            x: startX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            colour: COLOURS.BUTTON_GREY,
            label: '<',
            labelStyle: TEXT_STYLES.BUTTON,
            onClick: () => this.moveLeft()
        });
        this.trackObj(leftBtn.rect, leftBtn.text!);

        // Nose button (centre) - state tracked via isPressed ref, handled in update loop
        const noseX = startX + buttonWidth + gap;
        const noseBtn = createButton({
            scene: this.scene,
            x: noseX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            colour: COLOURS.BUTTON_RED,
            label: 'NOSE',
            labelStyle: TEXT_STYLES.BUTTON_SMALL
        });
        this.noseButtonPressed = noseBtn.isPressed;
        this.trackObj(noseBtn.rect, noseBtn.text!);

        // Right button
        const rightX = noseX + buttonWidth + gap;
        const rightBtn = createButton({
            scene: this.scene,
            x: rightX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            colour: COLOURS.BUTTON_GREY,
            label: '>',
            labelStyle: TEXT_STYLES.BUTTON,
            onClick: () => this.moveRight()
        });
        this.trackObj(rightBtn.rect, rightBtn.text!);
    }

    private stopElfInLane(lane: number): void {
        this.elves.forEach(elf => {
            if (elf.lane === lane) {
                elf.freeze();
            }
        });
    }

    private resumeAllElves(): void {
        this.elves.forEach(elf => elf.unfreeze());
    }

    private updateElves(delta: number): void {
        const bgSpeed = this.config.bgScrollSpeed ?? 0;

        for (let i = this.elves.length - 1; i >= 0; i--) {
            const elf = this.elves[i];
            elf.update(delta, bgSpeed);

            // Check if escaped (reached top)
            if (elf.hasEscaped()) {
                this.config.onEscape?.(elf);
                this.removeElf(i);
            }
        }
    }

    private removeElf(index: number): void {
        const elf = this.elves[index];
        this.laneOccupied[elf.lane] = false;
        elf.destroy();
        this.elves.splice(index, 1);
        this.untrackObj(elf);
    }

    private checkCollisions(): void {
        if (!this.noseActive) return;

        const rudolphLane = this.rudolph.getCurrentLane();
        const rudolphBounds = this.rudolph.getBounds();

        for (let i = this.elves.length - 1; i >= 0; i--) {
            const elf = this.elves[i];

            if (elf.lane !== rudolphLane) continue;

            const elfBounds = elf.getBounds();

            if (Phaser.Geom.Rectangle.Overlaps(rudolphBounds, elfBounds)) {
                // Arrest!
                this.config.onArrest?.(elf);
                this.removeElf(i);
            }
        }
    }
}
