import { PlayerMark } from './PlayerMark'

export interface GridField {
    state: PlayerMark | null
}

export interface RoundGrid {
    fields: GridField[]
}
