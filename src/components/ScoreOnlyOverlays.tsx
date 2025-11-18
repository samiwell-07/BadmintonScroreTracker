import { useCallback, useMemo } from 'react'
import { Affix, Button, Group, Paper, Stack, Text } from '@mantine/core'
import type { PlayerId, PlayerState } from '../types/match'
import { getRotationSummary } from '../utils/doublesRotation'
import type { Translations } from '../i18n/translations'

interface ScoreOnlyOverlaysProps {
  active: boolean
  mutedText: string
  players: PlayerState[]
  server: PlayerId
  doublesMode: boolean
  teammateServerMap: Record<PlayerId, string>
  onExitScoreOnly: () => void
  onSetServer: (playerId: PlayerId) => void
  onToggleServer: () => void
  t: Translations
}

export const ScoreOnlyOverlays = ({
  active,
  mutedText,
  players,
  server,
  doublesMode,
  teammateServerMap,
  onExitScoreOnly,
  onSetServer,
  onToggleServer,
  t,
}: ScoreOnlyOverlaysProps) => {
  const rotationSummary = useMemo(
    () =>
      doublesMode && players.length >= 2
        ? getRotationSummary(players, server, teammateServerMap)
        : null,
    [doublesMode, players, server, teammateServerMap],
  )

  const getServerHandler = useCallback(
    (playerId: PlayerId) => () => onSetServer(playerId),
    [onSetServer],
  )

  if (!active) {
    return null
  }

  return (
    <>
      <Affix position={{ top: 16, right: 16 }}>
        <Button size="sm" color="teal" onClick={onExitScoreOnly}>
          {t.common.showFullView}
        </Button>
      </Affix>
      <Paper withBorder shadow="lg" radius="lg" p="md">
        <Stack gap="xs">
          {rotationSummary && (
            <Stack gap={2}>
              <Text size="xs" fw={600} c={mutedText}>
                {t.rotation.heading}
              </Text>
              <Text size="sm">
                {t.rotation.servingSentence(
                  rotationSummary.servingTeamName,
                  rotationSummary.courtSide,
                  rotationSummary.servingPartnerName,
                )}
              </Text>
              <Text size="sm" c={mutedText}>
                {t.rotation.receivingSentence(
                  rotationSummary.receivingTeamName,
                  rotationSummary.receivingPartnerName,
                )}
              </Text>
            </Stack>
          )}
          <Text size="xs" c={mutedText} fw={600}>
            {t.overlays.servingLabel}
          </Text>
          <Group gap="xs" wrap="wrap">
            {players.map((player) => {
              const isCurrentServer = server === player.id
              return (
                <Button
                  key={player.id}
                  size="sm"
                  variant={isCurrentServer ? 'filled' : 'light'}
                  color={isCurrentServer ? 'cyan' : 'gray'}
                  onClick={getServerHandler(player.id)}
                >
                  {player.name}
                </Button>
              )
            })}
            <Button size="sm" variant="subtle" color="gray" onClick={onToggleServer}>
              {t.overlays.swapButton}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </>
  )
}
