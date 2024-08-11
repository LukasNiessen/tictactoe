export class GameStatsStore {
    private winCountX: number
    private winCountO: number

    constructor() {
        this.winCountX = 0
        this.winCountO = 0
    }

    incrementWinX(): void {
        this.winCountX++
    }

    incrementWinO(): void {
        this.winCountO++
    }

    getWinCountX(): number {
        return this.winCountX
    }

    getWinCountO(): number {
        return this.winCountO
    }

    resetStats(): void {
        this.winCountX = 0
        this.winCountO = 0
    }

    toString(): string {
        return `X wins: ${this.winCountX}\nY wins: ${this.winCountO}`
    }
}
