import type { MatchState } from '../types/match'
import type { RelativeTimeTranslations } from '../i18n/translations'

export type MatchConfig = Pick<MatchState, 'maxPoint' | 'raceTo' | 'winByTwo'>

export const clampPoints = (value: number, maxPoint: number) =>
  Math.min(maxPoint, Math.max(0, value))

export const didWinGame = (
  playerScore: number,
  opponentScore: number,
  state: MatchConfig,
) => {
  if (playerScore >= state.maxPoint) {
    return true
  }

  if (playerScore < state.raceTo) {
    return false
  }

  if (!state.winByTwo) {
    return true
  }

  return playerScore - opponentScore >= 2
}

export const formatRelativeTime = (
  timestamp: number,
  localeStrings: RelativeTimeTranslations,
) => {
  const elapsedMs = Date.now() - timestamp
  const seconds = Math.floor(elapsedMs / 1000)

  if (seconds < 5) return localeStrings.justNow
  if (seconds < 60) return localeStrings.secondsAgo(seconds)

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return localeStrings.minutesAgo(minutes)

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return localeStrings.hoursAgo(hours)

  const days = Math.floor(hours / 24)
  return localeStrings.daysAgo(days)
}

const pad = (value: number) => value.toString().padStart(2, '0')

export const formatDuration = (durationMs: number) => {
  const safeMs = Math.max(0, durationMs)
  const totalSeconds = Math.floor(safeMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`
  }

  return `${minutes}:${pad(seconds)}`
}
