import {
  createDefaultTeammateServerMap,
  getDefaultTeammates,
  type MatchState,
  type PlayerId,
  type PlayerState,
  type TeammateState,
} from '../../types/match'

export const normalizeTeammates = (
  playerId: PlayerId,
  teammates?: Partial<TeammateState>[] | null,
): TeammateState[] => {
  const defaults = getDefaultTeammates(playerId)
  if (!Array.isArray(teammates) || teammates.length === 0) {
    return defaults.map((mate) => ({ ...mate }))
  }

  return defaults.map((fallback, index) => {
    const source = teammates[index]
    if (!source) {
      return { ...fallback }
    }

    return {
      id: source.id?.toString() || fallback.id,
      name:
        typeof source.name === 'string' && source.name.length > 0
          ? source.name
          : fallback.name,
    }
  })
}

export const normalizeTeammateServerMap = (
  players: MatchState['players'],
  stored?: Partial<Record<PlayerId, string>> | null,
) => {
  const defaults = createDefaultTeammateServerMap()
  const map: Record<PlayerId, string> = { ...defaults }

  players.forEach((player) => {
    const storedId = stored?.[player.id]
    const hasStored = player.teammates.some((mate) => mate.id === storedId)
    map[player.id] = hasStored
      ? (storedId as string)
      : (player.teammates[0]?.id ?? defaults[player.id])
  })

  return map
}

export const rotateRightCourtTeammate = (
  player: PlayerState,
  map: Record<PlayerId, string>,
) => {
  if (player.teammates.length === 0) {
    return
  }

  const currentRightId = map[player.id] ?? player.teammates[0]?.id
  const nextRight =
    player.teammates.find((mate) => mate.id !== currentRightId) ?? player.teammates[0]
  map[player.id] = nextRight.id
}
