import { ReadInActionHelper } from './ReadInActionHelper'
import {
    BadInputTryAgainString,
    getNextMovePromptQuery,
    MalformattedErrorString,
    PressEnterForNextRoundString,
} from '../configs/UiConfig'

jest.mock('readline')

describe('ReadInActionHelper', () => {
    let readInActionHelper: ReadInActionHelper

    beforeEach(() => {
        jest.clearAllMocks()
        readInActionHelper = new ReadInActionHelper()
    })

    describe('readInEnter', () => {
        it('returns "Enter" when input is empty', async () => {
            const mockReadFromConsole = jest
                .spyOn(readInActionHelper as any, 'readFromConsole')
                .mockResolvedValue('')
            const result = await readInActionHelper.readInEnter()
            expect(result).toBe('Enter')
            expect(mockReadFromConsole).toHaveBeenCalledWith(
                PressEnterForNextRoundString
            )
        })

        it('returns "E" when input is "e"', async () => {
            const mockReadFromConsole = jest
                .spyOn(readInActionHelper as any, 'readFromConsole')
                .mockResolvedValue('e')
            const result = await readInActionHelper.readInEnter()
            expect(result).toBe('E')
            expect(mockReadFromConsole).toHaveBeenCalledWith(
                PressEnterForNextRoundString
            )
        })

        it('returns "P" when input is "p"', async () => {
            const mockReadFromConsole = jest
                .spyOn(readInActionHelper as any, 'readFromConsole')
                .mockResolvedValue('p')
            const result = await readInActionHelper.readInEnter()
            expect(result).toBe('P')
            expect(mockReadFromConsole).toHaveBeenCalledWith(
                PressEnterForNextRoundString
            )
        })

        it('prompts again on invalid input', async () => {
            const consoleSpy = jest.spyOn(console, 'log')

            const mockReadFromConsole = jest
                .spyOn(readInActionHelper as any, 'readFromConsole')
                .mockResolvedValueOnce('invalid')
                .mockResolvedValueOnce('e')

            const result = await readInActionHelper.readInEnter()

            expect(result).toBe('E')
            expect(mockReadFromConsole).toHaveBeenCalledWith(
                PressEnterForNextRoundString
            )

            expect(consoleSpy).toHaveBeenCalledWith(BadInputTryAgainString)
            expect(mockReadFromConsole).toHaveBeenCalledTimes(2)
        })
    })

    describe('readInAction', () => {
        it('returns "E" when input is "e"', async () => {
            const mockReadFromConsole = jest
                .spyOn(readInActionHelper as any, 'readFromConsole')
                .mockResolvedValue('e')
            const result = await readInActionHelper.readInAction('X')
            expect(result).toBe('E')
            expect(mockReadFromConsole).toHaveBeenCalledWith(
                getNextMovePromptQuery('X')
            )
        })

        it('returns "P" when input is "p"', async () => {
            const mockReadFromConsole = jest
                .spyOn(readInActionHelper as any, 'readFromConsole')
                .mockResolvedValue('p')
            const result = await readInActionHelper.readInAction('O')
            expect(result).toBe('P')
            expect(mockReadFromConsole).toHaveBeenCalledWith(
                getNextMovePromptQuery('O')
            )
        })

        it('returns correct PlayerAction for valid input', async () => {
            jest.spyOn(
                readInActionHelper as any,
                'readFromConsole'
            ).mockResolvedValue('1:2')
            const result = await readInActionHelper.readInAction('X')
            expect(result).toEqual({
                row: 0,
                column: 1,
                moveMark: 'X',
            })
        })

        it('prompts again on malformatted input', async () => {
            const consoleSpy = jest.spyOn(console, 'log')

            const mock = jest
                .spyOn(readInActionHelper as any, 'readFromConsole')
                .mockResolvedValueOnce('2.3')
                .mockResolvedValue('2:3')

            const result = await readInActionHelper.readInAction('O')
            expect(result).toEqual({
                row: 1,
                column: 2,
                moveMark: 'O',
            })

            expect(consoleSpy).toHaveBeenCalledWith(MalformattedErrorString)
            expect(mock).toHaveBeenCalledTimes(2)
        })

        it('uses correct prompt for each player', async () => {
            const mock = jest
                .spyOn(readInActionHelper as any, 'readFromConsole')
                .mockResolvedValueOnce('1:1')

            await readInActionHelper.readInAction('X')
            expect(mock).toHaveBeenCalledWith(getNextMovePromptQuery('X'))
            const mock2 = jest
                .spyOn(readInActionHelper as any, 'readFromConsole')
                .mockResolvedValueOnce('2:1')

            await readInActionHelper.readInAction('O')
            expect(mock2).toHaveBeenCalledWith(getNextMovePromptQuery('O'))
        })
    })

    describe('close', () => {
        it('should close the readline interface', () => {
            const mockClose = jest.fn()
            const mockRl = {
                close: mockClose,
            }
            ;(readInActionHelper as any).rl = mockRl
            readInActionHelper.close()
            expect(mockClose).toHaveBeenCalledTimes(1)
        })
    })
})
