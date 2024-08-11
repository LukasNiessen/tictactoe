import { RoundGrid } from '../types/RoundGrid'
import { printGridToConsole } from './RoundConsoleHelper'

describe('printGridToConsole', () => {
    let consoleSpy: jest.SpyInstance
    let stdoutSpy: jest.SpyInstance
    let consoleLogSpy: jest.SpyInstance
    let consoleCleanSpy: jest.SpyInstance

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation()
        stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation()
        consoleLogSpy = jest.spyOn(console, 'log')
        consoleCleanSpy = jest.spyOn(console, 'clear').mockImplementation()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('clears console when clearConsole is true', () => {
        const grid: RoundGrid = { fields: [] }
        printGridToConsole(grid, true)
        expect(consoleCleanSpy).toHaveBeenCalled()
    })

    it('does not clear console when clearConsole is false', () => {
        const grid: RoundGrid = { fields: [] }
        printGridToConsole(grid, false)
        expect(consoleCleanSpy).not.toHaveBeenCalled()
    })
})
