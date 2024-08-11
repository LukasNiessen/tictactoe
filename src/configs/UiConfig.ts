import { PlayerMark } from '../types/PlayerMark'
import { GridColumnCount } from './GameConfig'

export const InvalidInputTryAgainString =
    'The inserted field is not valid. Try again:'

export const MalformattedErrorString =
    'Please enter a string in the format (Row:Column) without the round brackets where Row and Column are integers.'

export const BadInputTryAgainString = 'Bad input, try again.'
export const PressEnterForNextRoundString = 'Press enter for next round... '

export function getNextMovePromptQuery(currentPlayer: PlayerMark): string {
    return `${currentPlayer}: Please enter the position of your mark (Row:Column): `
}

export const GridFieldSeparationSpace = '  '
export const GridFieldDividerH = '-'.repeat(GridColumnCount * 9)
export const GridFieldDividerV = `${GridFieldSeparationSpace}|${GridFieldSeparationSpace}`
