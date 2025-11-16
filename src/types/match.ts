export type PlayerId = 'playerA' | 'playerB'

export interface TeammateState {
  id: string
  name: string
}

export interface PlayerState {
  id: PlayerId
  name: string
  points: number
  games: number
  teammates: TeammateState[]
}

export interface MatchState {
  players: PlayerState[]
  raceTo: number
  maxPoint: number
  winByTwo: boolean
  bestOf: (typeof BEST_OF_OPTIONS)[number]
  server: PlayerId
  lastUpdated: number
  matchWinner: PlayerId | null
  completedGames: CompletedGame[]
  clockRunning: boolean
  clockStartedAt: number | null
  clockElapsedMs: number
  savedNames: string[]
  doublesMode: boolean
  teammateServerMap: Record<PlayerId, string>
}

export const STORAGE_KEY = 'bst-score-state'
export const HISTORY_LIMIT = 25
export const BEST_OF_OPTIONS = [1, 3, 5] as const
export const GAME_HISTORY_LIMIT = 25
export const SAVED_NAMES_LIMIT = 8

export interface CompletedGame {
  id: string
  number: number
  timestamp: number
  winnerId: PlayerId
  winnerName: string
  durationMs: number
  scores: Record<PlayerId, { name: string; points: number }>
}

export const getDefaultName = (playerId: PlayerId) =>
  playerId === 'playerA' ? 'Player A' : 'Player B'

export const getDefaultTeammates = (playerId: PlayerId): TeammateState[] => {
  const baseLabel = getDefaultName(playerId)
  return [1, 2].map((position) => ({
    id: `${playerId}-mate-${position}`,
    name: `${baseLabel} ${position}`,
  }))
}

export const createDefaultTeammateServerMap = (): Record<PlayerId, string> => ({
  playerA: getDefaultTeammates('playerA')[0].id,
  playerB: getDefaultTeammates('playerB')[0].id,
})

export const DEFAULT_STATE: MatchState = {
  players: [
    {
      id: 'playerA',
      name: 'Player A',
      points: 0,
      games: 0,
      teammates: getDefaultTeammates('playerA'),
    },
    {
      id: 'playerB',
      name: 'Player B',
      points: 0,
      games: 0,
      teammates: getDefaultTeammates('playerB'),
    },
  ],
  raceTo: 21,
  maxPoint: 30,
  winByTwo: true,
  bestOf: 3,
  server: 'playerA',
  lastUpdated: Date.now(),
  matchWinner: null,
  completedGames: [],
  clockRunning: true,
  clockStartedAt: Date.now(),
  clockElapsedMs: 0,
  savedNames: [],
  doublesMode: false,
  teammateServerMap: createDefaultTeammateServerMap(),
}
