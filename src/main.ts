import StartGame from './game/main';

document.addEventListener('DOMContentLoaded', async () => {
    // Wait for Google Font to load before starting the game
    await document.fonts.ready;
    StartGame('game-container');
});