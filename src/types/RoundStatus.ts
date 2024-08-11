import { PlayerMark } from './PlayerMark'

export interface RoundStatus {
    isFinished: boolean
    isDraw: boolean
    winner: PlayerMark | null
}
