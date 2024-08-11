import { GameArena } from './logic/GameArena'

export async function main() {
    const gameArena = new GameArena()
    gameArena.startArena()
}

if (require.main === module) {
    main()
}
