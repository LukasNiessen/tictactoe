import { InvalidInputTryAgainString } from '../configs/UiConfig'
import { GameStatsStore } from '../state/GameStatsStore'
import { GameStore } from '../state/GameStore'
import { RoundResult } from '../types/RoundResult'
import { ReadInActionHelper } from '../util/ReadInActionHelper'
import { printGridToConsole } from '../util/RoundConsoleHelper'
import { GameRound } from './GameRound'

export class GameArena {
    private readInHelper = new ReadInActionHelper()
    private gameStatsStore = new GameStatsStore()
    private gameStore = new GameStore()

    /**
     * Starts new rounds until aborted
     */
    public async startArena(): Promise<void> {
        while (true) {
            const gameResult = await this.startNewRound()
            if (gameResult.aborted) {
                this.doCleanUp()
                return
            }

            if (gameResult.roundStatus) {
                if (gameResult.roundStatus.isDraw) {
                    this.gameStore.setCurrentStartingPlayer('X')
                } else if (gameResult.roundStatus.winner !== null) {
                    if (gameResult.roundStatus.winner === 'X') {
                        this.gameStatsStore.incrementWinX()
                        this.gameStore.setCurrentStartingPlayer('O')
                    } else {
                        this.gameStatsStore.incrementWinO()
                        this.gameStore.setCurrentStartingPlayer('X')
                    }
                }
            }

            // wait for enter for next round
            while (true) {
                const input = await this.readInHelper.readInEnter()
                if (input === 'E') {
                    this.doCleanUp()
                    return
                } else if (input === 'P') {
                    this.printStats()
                } else if (input === 'Enter') {
                    // next round
                    break
                }
            }
        }
    }

    private doCleanUp() {
        this.readInHelper.close()
    }

    private printStats() {
        console.log('')
        console.log('Stats:')
        console.log(this.gameStatsStore.toString())
        console.log('')
    }

    private createNewRound(): GameRound {
        return new GameRound(this.gameStore.getCurrentStartingPlayer())
    }

    private async startNewRound(): Promise<RoundResult> {
        const game = this.createNewRound()

        while (true) {
            printGridToConsole(game.grid)

            const moveMark = game.isNextMoveFromPlayer1() ? 'X' : 'O'

            while (true) {
                const action = await this.readInHelper.readInAction(moveMark)

                if (action === 'E') {
                    return {
                        roundStatus: null,
                        aborted: true,
                    }
                } else if (action === 'P') {
                    this.printStats()
                } else if (action === 'Enter') {
                    // not permitted here
                    console.log(InvalidInputTryAgainString)
                } else {
                    // action is a game move
                    const wasSuccessful = game.attemptMove(action)
                    if (wasSuccessful) {
                        break
                    } else {
                        console.log(InvalidInputTryAgainString)
                    }
                }
            }

            if (game.getRoundStatus().isFinished) {
                printGridToConsole(game.grid, false)
                return {
                    roundStatus: game.getRoundStatus(),
                    aborted: false,
                }
            }
        }
    }
}
