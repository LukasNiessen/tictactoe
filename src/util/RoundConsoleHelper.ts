import { GridColumnCount } from '../configs/GameConfig'
import {
    GridFieldDividerH,
    GridFieldDividerV,
    GridFieldSeparationSpace,
} from '../configs/UiConfig'
import { RoundGrid } from '../types/RoundGrid'

export function printGridToConsole(
    grid: RoundGrid,
    clearConsole: boolean = true
) {
    if (clearConsole) {
        console.clear()
    }
    console.log('\n')
    for (let i = 0; i < grid.fields.length; i++) {
        if (i !== 0 && i % GridColumnCount === 0) {
            // print horizontal divider
            console.log('')
            process.stdout.write(GridFieldDividerH)
            console.log('')
        }

        // print field
        const stateString =
            grid.fields[i].state === null
                ? `${GridFieldSeparationSpace} ${GridFieldSeparationSpace}`
                : `${GridFieldSeparationSpace}${grid.fields[i].state}${GridFieldSeparationSpace}`

        process.stdout.write(stateString)

        if ((i + 1) % GridColumnCount !== 0) {
            // print vertical divider
            process.stdout.write(GridFieldDividerV)
        }
    }
    console.log('\n')
}
