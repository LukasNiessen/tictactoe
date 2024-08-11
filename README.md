# TicTacToe

How to start the game:
1. Open the terminal
2. Run the command `npm i`
3. Run the command `npm run start`

The game can be customized by adjusting the constants in `src/configs/GameConfig.ts` and `src/configs/UiConfig.ts`.
GameConfig even allows you to play on 10x10 grids for example. Even non-square grids such as 7x5 are possible.

# Other information
- I code on Windows 11.
- The game was programmed in the TypeScript language in VS Code.

# Notes
- Developed using TDD unit tests. It's missing integration tests though, in particular for GameArena.
- Draws are detected but not included in the stats as the exercise sheet did not do that either.