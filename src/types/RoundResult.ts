import { RoundStatus } from './RoundStatus'

export type RoundResult = {
    roundStatus: RoundStatus | null
    aborted: boolean
}
