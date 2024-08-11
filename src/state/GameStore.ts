import { PlayerMark } from '../types/PlayerMark'

export class GameStore {
    private currentStartingPlayer: PlayerMark

    constructor() {
        this.currentStartingPlayer = 'X'
    }

    getCurrentStartingPlayer(): PlayerMark {
        return this.currentStartingPlayer
    }

    setCurrentStartingPlayer(mark: PlayerMark): void {
        this.currentStartingPlayer = mark
    }
}
