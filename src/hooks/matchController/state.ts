import {
  BEST_OF_OPTIONS,
  DEFAULT_STATE,
  GAME_HISTORY_LIMIT,
  SAVED_NAMES_LIMIT,
  STORAGE_KEY,
  createDefaultTeammateServerMap,
  type MatchState,
  type PlayerId,
} from '../../types/match'
import { createFreshClockState } from './clock'
import { normalizeTeammates, normalizeTeammateServerMap } from './teammates'

const createDefaultPlayers = () =>
  DEFAULT_STATE.players.map((player) => ({
    ...player,
    teammates: player.teammates.map((teammate) => ({ ...teammate })),
  }))

export const createDefaultState = (): MatchState => ({
  ...DEFAULT_STATE,
  ...createFreshClockState(),
  players: createDefaultPlayers(),
  completedGames: [],
  savedNames: [],
  lastUpdated: Date.now(),
  doublesMode: DEFAULT_STATE.doublesMode,
  teammateServerMap: { ...createDefaultTeammateServerMap() },
})

const clampCompletedGames = (games: MatchState['completedGames']) =>
  games
    .map((game, index) => ({
      ...game,
      number: game?.number ?? index + 1,
      durationMs: typeof game?.durationMs === 'number' ? Math.max(0, game.durationMs) : 0,
    }))
    .slice(0, GAME_HISTORY_LIMIT)

const sanitizeSavedNames = (names: unknown) =>
  Array.isArray(names)
    ? names
        .map((name) => name?.toString().trim())
        .filter((name): name is string => Boolean(name))
        .slice(0, SAVED_NAMES_LIMIT)
    : DEFAULT_STATE.savedNames

const sanitizeClock = (parsed: Partial<MatchState>) => {
  const clockRunning =
    typeof parsed.clockRunning === 'boolean'
      ? parsed.clockRunning
      : DEFAULT_STATE.clockRunning
  const clockElapsedMs = Math.max(
    0,
    typeof parsed.clockElapsedMs === 'number'
      ? parsed.clockElapsedMs
      : DEFAULT_STATE.clockElapsedMs,
  )
  const clockStartedAt =
    typeof parsed.clockStartedAt === 'number'
      ? parsed.clockStartedAt
      : clockRunning
        ? Date.now()
        : null

  return { clockRunning, clockElapsedMs, clockStartedAt }
}

const isValidBestOf = (value: unknown): value is MatchState['bestOf'] =>
  typeof value === 'number' && BEST_OF_OPTIONS.some((option) => option === value)

export const readFromStorage = (): MatchState => {
  if (typeof window === 'undefined') {
    return createDefaultState()
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return createDefaultState()
    }

    const parsed = JSON.parse(stored) as Partial<MatchState>
    const parsedBestOf = isValidBestOf(parsed.bestOf)
      ? parsed.bestOf
      : DEFAULT_STATE.bestOf
    const parsedMaxPoint = parsed.maxPoint ?? DEFAULT_STATE.maxPoint
    const parsedRaceTo = parsed.raceTo ?? DEFAULT_STATE.raceTo

    const normalizedPlayers = DEFAULT_STATE.players.map((defaultPlayer, index) => {
      const storedPlayer = parsed.players?.[index]
      const resolvedId = (storedPlayer?.id as PlayerId) ?? defaultPlayer.id

      return {
        ...defaultPlayer,
        ...storedPlayer,
        id: resolvedId,
        teammates: normalizeTeammates(resolvedId, storedPlayer?.teammates),
      }
    })

    const { clockRunning, clockElapsedMs, clockStartedAt } = sanitizeClock(parsed)

    return {
      ...createDefaultState(),
      ...parsed,
      players: normalizedPlayers,
      matchWinner: parsed.matchWinner ?? null,
      server: parsed.server ?? DEFAULT_STATE.server,
      raceTo: Math.min(parsedRaceTo, parsedMaxPoint),
      maxPoint: parsedMaxPoint,
      winByTwo: parsed.winByTwo ?? DEFAULT_STATE.winByTwo,
      bestOf: parsedBestOf,
      completedGames: clampCompletedGames(
        Array.isArray(parsed.completedGames)
          ? parsed.completedGames
          : DEFAULT_STATE.completedGames,
      ),
      clockRunning,
      clockElapsedMs,
      clockStartedAt,
      savedNames: sanitizeSavedNames(parsed.savedNames),
      doublesMode:
        typeof parsed.doublesMode === 'boolean'
          ? parsed.doublesMode
          : DEFAULT_STATE.doublesMode,
      teammateServerMap: normalizeTeammateServerMap(
        normalizedPlayers,
        parsed.teammateServerMap,
      ),
    }
  } catch (error) {
    console.warn('Failed to parse stored match state', error)
    return createDefaultState()
  }
}
