import { GameRound } from './GameRound'
import { PlayerMark } from '../types/PlayerMark'
import { PlayerMove } from '../types/PlayerMove'
import {
    GridColumnCount,
    GridRowCount,
    GridTotalFieldsCount,
} from '../configs/GameConfig'

describe('GameRound', () => {
    let gameRound: GameRound

    beforeEach(() => {
        gameRound = new GameRound('X')
    })

    describe('constructor', () => {
        it('initializes with correct starting player', () => {
            expect(gameRound.startingPlayer).toBe('X')
            expect(gameRound.moveCount).toBe(0)
            expect(gameRound.grid.fields.length).toBe(GridTotalFieldsCount)
            expect(
                gameRound.grid.fields.every((field) => field.state === null)
            ).toBe(true)
        })
    })

    describe('attemptMove', () => {
        it('returns true and update grid for valid move', () => {
            const move: PlayerMove = { row: 0, column: 0, moveMark: 'X' }
            expect(gameRound.attemptMove(move)).toBe(true)
            expect(gameRound.grid.fields[0].state).toBe('X')
            expect(gameRound.moveCount).toBe(1)
        })

        it('returns false for invalid move', () => {
            const move: PlayerMove = { row: 0, column: 0, moveMark: 'O' }
            expect(gameRound.attemptMove(move)).toBe(false)
            expect(gameRound.grid.fields[0].state).toBe(null)
            expect(gameRound.moveCount).toBe(0)
        })

        it('returns false for move on occupied field', () => {
            gameRound.attemptMove({ row: 0, column: 0, moveMark: 'X' })
            expect(
                gameRound.attemptMove({ row: 0, column: 0, moveMark: 'O' })
            ).toBe(false)
            expect(gameRound.grid.fields[0].state).toBe('X')
            expect(gameRound.moveCount).toBe(1)
        })

        it('returns false for out-of-bounds move', () => {
            expect(
                gameRound.attemptMove({
                    row: GridRowCount,
                    column: 0,
                    moveMark: 'X',
                })
            ).toBe(false)
            expect(
                gameRound.attemptMove({
                    row: 0,
                    column: GridColumnCount,
                    moveMark: 'X',
                })
            ).toBe(false)
            expect(
                gameRound.attemptMove({ row: -1, column: 0, moveMark: 'X' })
            ).toBe(false)
            expect(
                gameRound.attemptMove({ row: 0, column: -1, moveMark: 'X' })
            ).toBe(false)
        })
    })

    describe('isNextMoveFromPlayer1', () => {
        it('correctly alternates between players', () => {
            expect(gameRound.isNextMoveFromPlayer1()).toBe(true)
            gameRound.attemptMove({ row: 0, column: 0, moveMark: 'X' })
            expect(gameRound.isNextMoveFromPlayer1()).toBe(false)
            gameRound.attemptMove({ row: 0, column: 1, moveMark: 'O' })
            expect(gameRound.isNextMoveFromPlayer1()).toBe(true)
        })

        it('handles different starting players', () => {
            const gameRoundO = new GameRound('O')
            expect(gameRoundO.isNextMoveFromPlayer1()).toBe(false)
            gameRoundO.attemptMove({ row: 0, column: 0, moveMark: 'O' })
            expect(gameRoundO.isNextMoveFromPlayer1()).toBe(true)
        })
    })

    describe('getRoundStatus', () => {
        it('does not return finished for less than 5 moves', () => {
            for (let i = 0; i < 4; i++) {
                gameRound.attemptMove({
                    row: i,
                    column: i,
                    moveMark: i % 2 === 0 ? 'X' : 'O',
                })
            }
            expect(gameRound.getRoundStatus()).toEqual({
                isFinished: false,
                isDraw: false,
                winner: null,
            })
        })

        it('detects vertical win', () => {
            const moves: PlayerMove[] = [
                { row: 0, column: 0, moveMark: 'X' },
                { row: 0, column: 1, moveMark: 'O' },
                { row: 1, column: 0, moveMark: 'X' },
                { row: 1, column: 1, moveMark: 'O' },
                { row: 2, column: 0, moveMark: 'X' },
            ]
            moves.forEach((move) => gameRound.attemptMove(move))
            expect(gameRound.getRoundStatus()).toEqual({
                isFinished: true,
                isDraw: false,
                winner: 'X',
            })
        })

        it('detects horizontal win', () => {
            const moves: PlayerMove[] = [
                { row: 0, column: 0, moveMark: 'X' },
                { row: 1, column: 0, moveMark: 'O' },
                { row: 2, column: 0, moveMark: 'X' },
                { row: 1, column: 1, moveMark: 'O' },
                { row: 2, column: 1, moveMark: 'X' },
                { row: 1, column: 2, moveMark: 'O' },
            ]
            moves.forEach((move) => gameRound.attemptMove(move))
            expect(gameRound.getRoundStatus()).toEqual({
                isFinished: true,
                isDraw: false,
                winner: 'O',
            })
        })

        it('detects diagonal win (top-left to bottom-right)', () => {
            const moves: PlayerMove[] = [
                { row: 0, column: 0, moveMark: 'X' },
                { row: 1, column: 0, moveMark: 'O' },
                { row: 1, column: 1, moveMark: 'X' },
                { row: 2, column: 1, moveMark: 'O' },
                { row: 2, column: 2, moveMark: 'X' },
            ]
            moves.forEach((move) => gameRound.attemptMove(move))
            expect(gameRound.getRoundStatus()).toEqual({
                isFinished: true,
                isDraw: false,
                winner: 'X',
            })
        })

        it('detects diagonal win (top-right to bottom-left)', () => {
            const moves: PlayerMove[] = [
                { row: 0, column: 1, moveMark: 'X' },
                { row: 2, column: 2, moveMark: 'O' },
                { row: 1, column: 0, moveMark: 'X' },
                { row: 0, column: 0, moveMark: 'O' },
                { row: 2, column: 1, moveMark: 'X' },
                { row: 1, column: 1, moveMark: 'O' },
            ]
            moves.forEach((move) => gameRound.attemptMove(move))
            expect(gameRound.getRoundStatus()).toEqual({
                isFinished: true,
                isDraw: false,
                winner: 'O',
            })
        })

        it('detects draw', () => {
            const moves: PlayerMove[] = [
                { row: 0, column: 0, moveMark: 'X' },
                { row: 1, column: 1, moveMark: 'O' },
                { row: 0, column: 1, moveMark: 'X' },
                { row: 0, column: 2, moveMark: 'O' },
                { row: 1, column: 2, moveMark: 'X' },
                { row: 1, column: 0, moveMark: 'O' },
                { row: 2, column: 0, moveMark: 'X' },
                { row: 2, column: 1, moveMark: 'O' },
                { row: 2, column: 2, moveMark: 'X' },
            ]
            moves.forEach((move) => gameRound.attemptMove(move))
            expect(gameRound.getRoundStatus()).toEqual({
                isFinished: true,
                isDraw: true,
                winner: null,
            })
        })

        it('returns not finished for ongoing game', () => {
            gameRound.attemptMove({ row: 0, column: 0, moveMark: 'X' })
            gameRound.attemptMove({ row: 1, column: 1, moveMark: 'O' })
            gameRound.attemptMove({ row: 2, column: 2, moveMark: 'X' })
            expect(gameRound.getRoundStatus()).toEqual({
                isFinished: false,
                isDraw: false,
                winner: null,
            })
        })
    })
})
