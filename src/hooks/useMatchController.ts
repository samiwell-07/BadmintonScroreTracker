import { useEffect, useMemo, useState } from 'react'
import {
  BEST_OF_OPTIONS,
  DEFAULT_STATE,
  GAME_HISTORY_LIMIT,
  HISTORY_LIMIT,
  STORAGE_KEY,
  SAVED_NAMES_LIMIT,
  getDefaultName,
  type CompletedGame,
  type MatchState,
  type PlayerId,
} from '../types/match'
import { clampPoints, didWinGame } from '../utils/match'
import { showToast } from '../utils/notifications'

const createFreshClockState = () => ({
  clockRunning: true,
  clockStartedAt: Date.now(),
  clockElapsedMs: 0,
})

const createDefaultState = (): MatchState => ({
  ...DEFAULT_STATE,
  ...createFreshClockState(),
  players: DEFAULT_STATE.players.map((player) => ({ ...player })),
  completedGames: [],
  savedNames: [],
  lastUpdated: Date.now(),
})

const getLiveElapsedMs = (state: MatchState) =>
  state.clockElapsedMs +
  (state.clockRunning && state.clockStartedAt
    ? Date.now() - state.clockStartedAt
    : 0)

const upsertSavedName = (names: string[], name: string) => {
  const lowered = name.toLowerCase()
  const filtered = names.filter(
    (existing) => existing.toLowerCase() !== lowered,
  )
  return [name, ...filtered].slice(0, SAVED_NAMES_LIMIT)
}

const readFromStorage = (): MatchState => {
  if (typeof window === 'undefined') {
    return createDefaultState()
  }

  const isValidBestOf = (value: unknown): value is MatchState['bestOf'] =>
    typeof value === 'number' &&
    BEST_OF_OPTIONS.some((option) => option === value)

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
    const parsedCompletedGames = (
      Array.isArray(parsed.completedGames)
        ? parsed.completedGames
        : DEFAULT_STATE.completedGames
    )
      .map((game, index) => ({
        ...game,
        number: game?.number ?? index + 1,
        durationMs:
          typeof game?.durationMs === 'number'
            ? Math.max(0, game.durationMs)
            : 0,
      }))
      .slice(0, GAME_HISTORY_LIMIT)
    const parsedSavedNames = Array.isArray(parsed.savedNames)
      ? parsed.savedNames
          .map((name) => name?.toString().trim())
          .filter((name): name is string => Boolean(name))
      : DEFAULT_STATE.savedNames
    const parsedClockRunning =
      typeof parsed.clockRunning === 'boolean'
        ? parsed.clockRunning
        : DEFAULT_STATE.clockRunning
    const parsedClockElapsed = Math.max(
      0,
      typeof parsed.clockElapsedMs === 'number'
        ? parsed.clockElapsedMs
        : DEFAULT_STATE.clockElapsedMs,
    )
    const parsedClockStartedAt =
      typeof parsed.clockStartedAt === 'number'
        ? parsed.clockStartedAt
        : parsedClockRunning
          ? Date.now()
          : null

    return {
      ...createDefaultState(),
      ...parsed,
      players:
        parsed.players?.map((player, index) => ({
          ...DEFAULT_STATE.players[index],
          ...player,
        })) ?? DEFAULT_STATE.players.map((player) => ({ ...player })),
      matchWinner: parsed.matchWinner ?? null,
      server: parsed.server ?? DEFAULT_STATE.server,
      raceTo: Math.min(parsedRaceTo, parsedMaxPoint),
      maxPoint: parsedMaxPoint,
      winByTwo: parsed.winByTwo ?? DEFAULT_STATE.winByTwo,
      bestOf: parsedBestOf,
      completedGames: parsedCompletedGames,
      clockRunning: parsedClockRunning,
      clockElapsedMs: parsedClockElapsed,
      clockStartedAt: parsedClockStartedAt,
      savedNames: parsedSavedNames.slice(0, SAVED_NAMES_LIMIT),
    }
  } catch (error) {
    console.warn('Failed to parse stored match state', error)
    return createDefaultState()
  }
}

const createGameId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const useMatchController = () => {
  const [match, setMatch] = useState<MatchState>(readFromStorage)
  const [history, setHistory] = useState<MatchState[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(match))
  }, [match])

  const gamesNeeded = useMemo(
    () => Math.ceil(match.bestOf / 2),
    [match.bestOf],
  )

  const pushUpdate = (updater: (state: MatchState) => MatchState) => {
    setMatch((previous) => {
      const next = updater(previous)
      setHistory((prevHistory) =>
        [previous, ...prevHistory].slice(0, HISTORY_LIMIT),
      )
      return { ...next, lastUpdated: Date.now() }
    })
  }

  const handleNameChange = (playerId: PlayerId, name: string) => {
    const trimmed = name.trim() || getDefaultName(playerId)
    pushUpdate((state) => ({
      ...state,
      players: state.players.map((player) =>
        player.id === playerId ? { ...player, name: trimmed } : player,
      ),
    }))
  }

  const handlePointChange = (playerId: PlayerId, delta: number) => {
    if (match.matchWinner && delta > 0) {
      showToast({
        title: 'Match finished',
        description: 'Start a new match to keep scoring.',
        status: 'info',
      })
      return
    }

    pushUpdate((state) => {
      const players = state.players.map((player) => {
        if (player.id !== playerId) {
          return { ...player }
        }

        const nextPoints = clampPoints(player.points + delta, state.maxPoint)
        return { ...player, points: nextPoints }
      })

      if (delta < 0) {
        return { ...state, players }
      }

      const scorer = players.find((player) => player.id === playerId)!
      const opponent = players.find((player) => player.id !== playerId)!
      const liveElapsedMs = getLiveElapsedMs(state)

      if (didWinGame(scorer.points, opponent.points, state)) {
        let clockRunning = state.clockRunning
        let clockStartedAt = state.clockStartedAt
        let clockElapsedMs = state.clockElapsedMs

        const completedGame: CompletedGame = {
          id: createGameId(),
          number: state.completedGames.length + 1,
          timestamp: Date.now(),
          winnerId: playerId,
          winnerName: scorer.name,
          durationMs: liveElapsedMs,
          scores: players.reduce<CompletedGame['scores']>((acc, player) => {
            acc[player.id] = { name: player.name, points: player.points }
            return acc
          }, {} as CompletedGame['scores']),
        }

        const updatedPlayers = players.map((player) => ({
          ...player,
          points: 0,
          games: player.id === playerId ? player.games + 1 : player.games,
        }))

        const winner = updatedPlayers.find(
          (player) => player.id === playerId,
        )!
        const isMatchWin = winner.games >= gamesNeeded
        const matchWinner = isMatchWin ? playerId : state.matchWinner

        if (isMatchWin) {
          clockElapsedMs = liveElapsedMs
          clockRunning = false
          clockStartedAt = null
        }

        showToast({
          title: `${winner.name} wins the ${isMatchWin ? 'match' : 'game'}`,
          status: 'success',
        })

        return {
          ...state,
          players: updatedPlayers,
          server: playerId,
          matchWinner: matchWinner ?? null,
          completedGames: [completedGame, ...state.completedGames].slice(
            0,
            GAME_HISTORY_LIMIT,
          ),
          clockRunning,
          clockStartedAt,
          clockElapsedMs,
        }
      }

      return { ...state, players, server: playerId }
    })
  }

  const handleUndo = () => {
    setHistory((previous) => {
      if (previous.length === 0) {
        showToast({ title: 'Nothing to undo', status: 'warning' })
        return previous
      }

      const [latest, ...rest] = previous
      setMatch(latest)
      return rest
    })
  }

  const handleResetGame = () => {
    pushUpdate((state) => ({
      ...state,
      players: state.players.map((player) => ({
        ...player,
        points: 0,
      })),
      matchWinner: state.matchWinner,
    }))
  }

  const handleResetMatch = () => {
    pushUpdate((state) => ({
      ...state,
      players: state.players.map((player) => ({
        ...player,
        points: 0,
        games: 0,
      })),
      matchWinner: null,
      server: 'playerA',
      ...createFreshClockState(),
    }))
  }

  const handleSwapEnds = () => {
    pushUpdate((state) => ({
      ...state,
      players: [...state.players].reverse(),
    }))
  }

  const handleServerToggle = () => {
    pushUpdate((state) => ({
      ...state,
      server: state.server === 'playerA' ? 'playerB' : 'playerA',
    }))
  }

  const handleSetServer = (playerId: PlayerId) => {
    const isValidPlayer = match.players.some((player) => player.id === playerId)
    if (!isValidPlayer) {
      return
    }

    pushUpdate((state) => ({
      ...state,
      server: playerId,
    }))
  }

  const handleSavePlayerName = (playerId: PlayerId) => {
    const player = match.players.find((entry) => entry.id === playerId)
    if (!player) {
      return
    }

    const trimmed = player.name.trim()
    if (!trimmed) {
      showToast({ title: 'Cannot save empty name', status: 'warning' })
      return
    }

    pushUpdate((state) => ({
      ...state,
      savedNames: upsertSavedName(state.savedNames, trimmed),
    }))

    showToast({ title: `Saved ${trimmed}`, status: 'success' })
  }

  const handleApplySavedName = (playerId: PlayerId, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
      return
    }

    pushUpdate((state) => ({
      ...state,
      players: state.players.map((player) =>
        player.id === playerId ? { ...player, name: trimmed } : player,
      ),
    }))
  }

  const handleClockToggle = () => {
    pushUpdate((state) => {
      if (state.clockRunning) {
        return {
          ...state,
          clockRunning: false,
          clockStartedAt: null,
          clockElapsedMs: getLiveElapsedMs(state),
        }
      }

      return {
        ...state,
        clockRunning: true,
        clockStartedAt: Date.now(),
      }
    })
  }

  const matchIsLive = !match.matchWinner

  return {
    match,
    history,
    gamesNeeded,
    matchIsLive,
    actions: {
      handleNameChange,
      handlePointChange,
      handleUndo,
      handleResetGame,
      handleResetMatch,
      handleSwapEnds,
      handleServerToggle,
      handleSetServer,
      handleSavePlayerName,
      handleApplySavedName,
      handleClockToggle,
      pushUpdate,
    },
  }
}
