import * as readline from 'readline'
import { PlayerMark } from '../types/PlayerMark'
import { PlayerAction } from '../types/PlayerAction'
import {
    BadInputTryAgainString,
    getNextMovePromptQuery,
    MalformattedErrorString,
    PressEnterForNextRoundString,
} from '../configs/UiConfig'

export class ReadInActionHelper {
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    /**
     * Enter or "E" or "P"
     */
    public async readInEnter(): Promise<PlayerAction> {
        const query = PressEnterForNextRoundString
        while (true) {
            const input = await this.readFromConsole(query)

            if (input === 'e') {
                return 'E'
            } else if (input === 'p') {
                return 'P'
            } else if (input === '') {
                return 'Enter'
            }
            console.log(BadInputTryAgainString)
        }
    }

    public async readInAction(
        currentPlayer: PlayerMark
    ): Promise<PlayerAction> {
        const query = getNextMovePromptQuery(currentPlayer)
        while (true) {
            try {
                const input = await this.readFromConsole(query)

                if (input === 'e') {
                    return 'E'
                } else if (input === 'p') {
                    return 'P'
                }

                const arr = input.split(':')
                if (arr.length !== 2) {
                    console.log(MalformattedErrorString)
                } else {
                    return {
                        row: Number(arr[0]) - 1,
                        column: Number(arr[1]) - 1,
                        moveMark: currentPlayer,
                    }
                }
            } catch {
                console.log(MalformattedErrorString)
            }
        }
    }

    private readFromConsole(query: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(query, (input: string) => {
                resolve(input)
            })
        })
    }

    public close() {
        this.rl.close()
    }
}
