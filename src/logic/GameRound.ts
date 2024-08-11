import { RoundStatus } from '../types/RoundStatus'
import { RoundGrid } from '../types/RoundGrid'
import { PlayerMark } from '../types/PlayerMark'
import { PlayerMove } from '../types/PlayerMove'
import {
    GridColumnCount,
    GridRowCount,
    GridTotalFieldsCount,
} from '../configs/GameConfig'

export class GameRound {
    startingPlayer: PlayerMark
    moveCount: number
    grid: RoundGrid

    constructor(startingPlayer: PlayerMark) {
        this.startingPlayer = startingPlayer
        this.moveCount = 0
        this.grid = {
            fields: Array(GridTotalFieldsCount).fill({
                state: null,
            }),
        }
    }

    /**
     *
     * @param move
     */
    public attemptMove(move: PlayerMove): boolean {
        if (this.isMoveValid(move)) {
            this.grid.fields[this.getArrayIndexFromMove(move)] = {
                state: move.moveMark,
            }
            this.moveCount++
            return true
        }

        return false
    }

    /**
     * Helper method
     *
     * Todo: Out of scope of this exercise, but we should distinguish
     * between a generally invalid input and an already taken field for example.
     * This method will not see such a difference.
     *
     * @param move
     * @returns will move succeed as it's allowed or not
     */
    private isMoveValid(move: PlayerMove): boolean {
        // check if move is from the correct player
        if (this.isNextMoveFromPlayer1() && move.moveMark !== 'X') {
            return false
        }
        if (!this.isNextMoveFromPlayer1() && move.moveMark !== 'O') {
            return false
        }

        // check too large numbers
        if (move.row > GridRowCount - 1) {
            return false
        }
        if (move.column > GridColumnCount - 1) {
            return false
        }

        // check too small numbers
        if (move.row < 0) {
            return false
        }
        if (move.column < 0) {
            return false
        }

        // check if field is occupied already
        if (this.grid.fields[this.getArrayIndexFromMove(move)].state !== null) {
            return false
        }

        return true
    }

    /**
     * Helper method
     *
     * @param move
     * @returns returns the index of the field in the grid-field-array that
     *          corresponds to a move given as input
     */
    private getArrayIndexFromMove(move: PlayerMove): number {
        return move.row * GridColumnCount + move.column
    }

    /**
     * Used to determine who makes the next move
     *
     * @returns whether the next move is player from player1 a.k.a. "x"
     */
    public isNextMoveFromPlayer1(): boolean {
        if (this.moveCount % 2 == 0) {
            return this.startingPlayer == 'X'
        } else {
            return this.startingPlayer == 'O'
        }
    }

    // Todo: this could be heavily optimized regarding time complexity
    // but that is out of scope for this task
    public getRoundStatus(): RoundStatus {
        // min 5 moves are needed for a round to be finished
        if (this.moveCount < 5) {
            return {
                isFinished: false,
                isDraw: false,
                winner: null,
            }
        }

        // Else check all possible winning, that is we check for
        // complete vertical and horizontal lines of the same
        // field-status and for oblique lines starting at a corner
        // check top-left corner
        const topLeftCornerMark = this.grid.fields[0].state
        if (topLeftCornerMark !== null) {
            let topLeftCornerYieldsWin = true
            for (let i = 1; i < GridRowCount && i < GridColumnCount; i++) {
                const index = GridColumnCount * i + i
                if (this.grid.fields[index].state !== topLeftCornerMark) {
                    topLeftCornerYieldsWin = false
                    break
                }
            }
            if (topLeftCornerYieldsWin) {
                return {
                    isFinished: true,
                    isDraw: false,
                    winner: topLeftCornerMark,
                }
            }
        }

        // check top-right corner
        const topRightCornerMark = this.grid.fields[GridColumnCount - 1].state
        if (topRightCornerMark !== null) {
            let topRightCornerYieldsWin = true
            for (let i = 1; i < GridRowCount && i < GridColumnCount; i++) {
                const index = GridColumnCount * i + (GridColumnCount - i - 1)
                if (this.grid.fields[index].state !== topRightCornerMark) {
                    topRightCornerYieldsWin = false
                    break
                }
            }
            if (topRightCornerYieldsWin) {
                return {
                    isFinished: true,
                    isDraw: false,
                    winner: topRightCornerMark,
                }
            }
        }

        // check bottom-right corner
        const bottomRightCornerMark =
            this.grid.fields[GridColumnCount * GridRowCount - 1].state
        if (bottomRightCornerMark !== null) {
            let bottomRightCornerYieldsWin = true
            for (let i = 1; i < GridRowCount && i < GridColumnCount; i++) {
                const index =
                    GridColumnCount * (GridRowCount - i - 1) +
                    (GridColumnCount - i - 1)
                if (this.grid.fields[index].state !== bottomRightCornerMark) {
                    bottomRightCornerYieldsWin = false
                    break
                }
            }
            if (bottomRightCornerYieldsWin) {
                return {
                    isFinished: true,
                    isDraw: false,
                    winner: bottomRightCornerMark,
                }
            }
        }

        // check bottom-left corner
        const bottomLeftCornerMark =
            this.grid.fields[GridColumnCount * (GridRowCount - 1)].state
        if (bottomLeftCornerMark !== null) {
            let bottomLeftCornerYieldsWin = true
            for (let i = 1; i < GridRowCount && i < GridColumnCount; i++) {
                const index = GridColumnCount * (GridRowCount - i - 1) + i
                if (this.grid.fields[index].state !== bottomLeftCornerMark) {
                    bottomLeftCornerYieldsWin = false
                    break
                }
            }
            if (bottomLeftCornerYieldsWin) {
                return {
                    isFinished: true,
                    isDraw: false,
                    winner: bottomLeftCornerMark,
                }
            }
        }

        // check horizontal lines
        for (let i = 0; i < GridRowCount; i++) {
            const mark = this.grid.fields[GridColumnCount * i].state
            if (mark !== null) {
                for (let j = 1; j < GridColumnCount; j++) {
                    if (
                        this.grid.fields[GridColumnCount * i + j].state !== mark
                    ) {
                        break
                    }
                    if (j === GridColumnCount - 1) {
                        return {
                            isFinished: true,
                            isDraw: false,
                            winner: mark,
                        }
                    }
                }
            }
        }

        // check vertical lines
        for (let i = 0; i < GridColumnCount; i++) {
            const mark = this.grid.fields[i].state
            if (mark !== null) {
                for (let j = 1; j < GridRowCount; j++) {
                    if (
                        this.grid.fields[GridColumnCount * j + i].state !== mark
                    ) {
                        break
                    }
                    if (j === GridRowCount - 1) {
                        return {
                            isFinished: true,
                            isDraw: false,
                            winner: mark,
                        }
                    }
                }
            }
        }

        // check if its a draw
        if (this.moveCount >= GridColumnCount * GridRowCount) {
            return {
                isFinished: true,
                isDraw: true,
                winner: null,
            }
        }

        return {
            isFinished: false,
            isDraw: false,
            winner: null,
        }
    }
}
