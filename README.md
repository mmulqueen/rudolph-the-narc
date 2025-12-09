# Rudolph the Narc

The North Pole has got a problem with white powder. Santa has been burning the advent candle at both ends and now a toxic snow-snorting culture has taken over the workshop. Mrs. Claus has tried to ban all frozen products from the workshop, but the pull of the flakes is strong. Noses are getting frozen off and the reindeers are angry that their carrot supply is being diverted to make nasal prostheses. Straight-edged Rudolph has had enough, he's putting his hoof down. Can you help Rudolph save Christmas? Patrol the workshop, intercept any snowy contraband, but don't disrupt the legitimate Christmas supplies.

## Gameplay

A vertically scrolling arcade game where you control Rudolph patrolling the workshop.

- **Movement**: Rudolph moves left/right only, staying at the bottom of the screen
- **Scrolling**: Background scrolls top-to-bottom creating forward motion; elves spawn at bottom and travel upward
- **Pursuit**: Activate Rudolph's police nose to stop an elf in their tracks. Collide with them while the nose is active to make an arrest
- **Scoring**: Arrest elves carrying contraband (snow) for points. Wrongfully arresting elves with legitimate goods (teddy bear, candy cane, coal) is bad!

### Scoring

| Event | Points |
|-------|--------|
| Arrest elf with snow (contraband) | +10 |
| Arrest innocent elf (teddy/candy/coal) | -2 |
| Elf with snow escapes | -5 |

### Controls

**On-screen buttons**: Left, Right, Nose Activate (hold)

**Keyboard**:
| Action | Keys |
|--------|------|
| Move Left | Left Arrow, A, 4 |
| Move Right | Right Arrow, D, 6 |
| Activate Nose (hold) | S, W, 5, 8, Space, Up Arrow, Down Arrow |

## Sprites

Located in `public/assets/sprites/`. Each sprite sheet is 64x64 (two 32x64 frames side by side):

- `elf_with_snow.png` - Contraband carrier (arrest!)
- `elf_with_teddy.png` - Legitimate goods
- `elf_with_candy.png` - Legitimate goods
- `elf_with_coal.png` - Legitimate goods
- `elf_with_nothing.png` - Empty-handed elf
- `rudolph_on_patrol.png` - Red nose (normal state)
- `rudolph_in_pursuit.png` - Red/blue flashing nose (pursuit mode)

## Technical Details

- Canvas: 256x396 logical resolution (playable area: 256x355, controls: 256x41)
- 8 horizontal positions (32px lanes)
- Canvas centred on screen, scaled to fit (CSS contain behavior)
- Maximum 1 elf per horizontal position at a time
- Elves spawn with randomised speeds

### Resolution Scaling

The game renders internally at a multiple of the logical resolution for crisp text and UI, then Phaser's scale manager fits this to the display. Sprites use their original 32x64 pixel assets scaled up at render time. The `SCALE_FACTOR` constant in `src/game/data/dimensions.ts` controls this multiplier and can be adjusted for different quality/performance tradeoffs.

---

## Development

Built with [Phaser 3.90.0](https://github.com/phaserjs/phaser), [Vite 6.3.1](https://github.com/vitejs/vite), and [TypeScript 5.7.2](https://github.com/microsoft/TypeScript).

### Requirements

[Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com) are required to install dependencies and run scripts.

### Available Commands

| Command | Description |
|---------|-------------|
| `yarn install` | Install project dependencies |
| `yarn dev` | Launch a development web server |
| `yarn build` | Create a production build in the `dist` folder |
| `yarn typecheck` | Run TypeScript type checking |

### Project Structure

| Path | Description |
|------|-------------|
| `index.html` | HTML page containing the game |
| `public/assets` | Game sprites, audio, etc. |
| `public/style.css` | Global layout styles |
| `src/main.ts` | Application bootstrap |
| `src/game/main.ts` | Game entry point: configures and starts the game |
| `src/game/scenes` | Phaser game scenes |
| `src/game/entities` | Game entities (Rudolph, Elf) |
| `src/game/controllers` | Game logic controllers |
| `src/game/effects` | Visual effects (strobe) |
| `src/game/ui` | UI components (buttons, messages) |
| `src/game/data` | Game configuration constants |

### Handling Assets

Place static assets (sprites, audio) in `public/assets`. Load them in Phaser:

```js
preload() {
    this.load.image('background', 'assets/bg.png');
}
```

### Production Build

Run `yarn build` to create a production bundle in `dist/`. Upload the entire `dist` folder contents to deploy.

---

Based on the [Phaser Vite TypeScript Template](https://github.com/phaserjs/template-vite-ts) by [Phaser Studio](https://phaser.io).
