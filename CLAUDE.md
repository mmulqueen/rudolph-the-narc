# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **yarn** (not npm). Run commands from the project root:

```bash
yarn dev          # Start development server with hot reload
yarn build        # Production build to dist/
yarn typecheck    # TypeScript type checking (tsc --noEmit)
```

## Architecture

This is a Phaser 3 game built with TypeScript and Vite. The game is a vertically scrolling arcade game where Rudolph patrols a workshop arresting elves carrying contraband (snow).

### Scene Flow
Boot → Preloader → MainMenu → Intro → Game → GameOver

### Key Architectural Pattern

The `GameplayController` (`src/game/controllers/GameplayController.ts`) is a reusable controller that encapsulates all core gameplay mechanics. It's configured via `GameplayControllerConfig` and handles:
- Rudolph and elf entity management
- Input handling (keyboard + touch buttons)
- Collision detection and arrest logic
- Lane-based movement system
- Spawn timing

Scenes inject callbacks (`onArrest`, `onEscape`) to handle game-specific scoring/UI while reusing the same controller logic.

### Lane System
The game uses an 8-lane system (32px each, total 256px width). Entities snap to lane center positions. Only one elf occupies a lane at a time. See `src/game/data/dimensions.ts` for constants and `getLaneX()` helper.

### Entity Pattern
`Rudolph` and `Elf` extend `Phaser.GameObjects.Sprite`. Elves have a type (`snow`/`teddy`/`candy`/`coal`/`nothing`) determining if they're contraband. Both use 2-frame walk animations loaded in `Preloader`.

### Configuration
Game constants are centralized in `src/game/data/`:
- `dimensions.ts` - Canvas size (256x396), lane dimensions, sprite sizes
- `scoring.ts` - Point values and elf type definitions
- `movement.ts` - Speed ranges and animation settings
- `style.ts` - Colors and text styles

### Sprites
Spritesheets in `public/assets/sprites/` are 64x64 (two 32x64 frames). Naming convention: `elf_with_{item}.png`, `rudolph_{mode}.png`.
