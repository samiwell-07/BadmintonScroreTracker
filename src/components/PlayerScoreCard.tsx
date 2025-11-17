import { Badge, Button, Card, Group, Stack, Text, TextInput, Title, useMantineTheme } from '@mantine/core'
import { type FocusEvent, type KeyboardEvent } from 'react'
import type { MatchConfig } from '../utils/match'
import { didWinGame } from '../utils/match'
import type { PlayerId, PlayerState } from '../types/match'
import { SavedNamesMenu } from './SavedNamesMenu'

interface PlayerScoreCardProps {
  player: PlayerState
  opponent: PlayerState
  cardBg: string
  mutedText: string
  isServer: boolean
  matchWinner: PlayerId | null
  gamesNeeded: number
  matchConfig: MatchConfig
  matchIsLive: boolean
  savedNames: string[]
  doublesMode: boolean
  onNameChange: (playerId: PlayerId, name: string) => void
  onPointChange: (playerId: PlayerId, delta: number) => void
  onApplySavedName: (playerId: PlayerId, name: string) => void
  onSaveName: (playerId: PlayerId) => void
  onTeammateNameChange: (playerId: PlayerId, teammateId: string, name: string) => void
  onSaveTeammateName: (playerId: PlayerId, teammateId: string) => void
  onSwapTeammates: (playerId: PlayerId) => void
}

export const PlayerScoreCard = ({
  player,
  opponent,
  cardBg,
  mutedText,
  isServer,
  matchWinner,
  gamesNeeded,
  matchConfig,
  matchIsLive,
  savedNames,
  doublesMode,
  onNameChange,
  onPointChange,
  onApplySavedName,
  onSaveName,
  onTeammateNameChange,
  onSaveTeammateName,
  onSwapTeammates,
}: PlayerScoreCardProps) => {
  const theme = useMantineTheme()
  const isGamePoint = didWinGame(player.points + 1, opponent.points, matchConfig)
  const isMatchPoint = isGamePoint && player.games === gamesNeeded - 1
  const isWinner = matchWinner === player.id
  const serviceCourtLabel = player.points % 2 === 0 ? 'Right court' : 'Left court'

  return (
    <Card
      withBorder
      radius="lg"
      p="xl"
      shadow="xl"
      style={{
        backgroundColor: cardBg,
        borderColor: isWinner ? theme.colors.green[5] : theme.colors.gray[4],
        borderWidth: isWinner ? 2 : 1,
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" gap="sm">
          <Group gap="xs" align="flex-start" style={{ flex: 1 }} wrap="nowrap">
            <TextInput
              key={`${player.id}-${player.name}`}
              defaultValue={player.name}
              onBlur={(event: FocusEvent<HTMLInputElement>) =>
                onNameChange(player.id, event.currentTarget.value)
              }
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') {
                  event.currentTarget.blur()
                }
              }}
              spellCheck={false}
              maxLength={24}
              flex={1}
              styles={{
                input: {
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  backgroundColor: 'transparent',
                  border: 'none',
                  paddingLeft: 0,
                },
              }}
            />
            <SavedNamesMenu
              savedNames={savedNames}
              menuPosition="bottom-end"
              onApply={(name) => onApplySavedName(player.id, name)}
              onSave={() => onSaveName(player.id)}
              saveLabel={`Save “${player.name}”`}
              onClear={() => onNameChange(player.id, '')}
              clearLabel="Reset to default"
            />
          </Group>
          <Group gap="xs" wrap="wrap">
            {isServer && (
              <Badge color="cyan" variant="light">
                Serving - {serviceCourtLabel}
              </Badge>
            )}
            {isMatchPoint && (
              <Badge color="red" variant="filled">
                Match point
              </Badge>
            )}
            {!isMatchPoint && isGamePoint && (
              <Badge color="orange" variant="light">
                Game point
              </Badge>
            )}
            {isWinner && (
              <Badge color="green" variant="light">
                Winner
              </Badge>
            )}
          </Group>
        </Group>
        <Stack gap="md">
          <div>
            <Group align="flex-end" gap="xl" wrap="wrap">
              <div>
                <Text size="sm" c={mutedText}>
                  Points
                </Text>
                <Title order={1} style={{ lineHeight: 1, fontSize: '4rem' }}>
                  {player.points}
                </Title>
              </div>
              <div>
                <Text size="sm" c={mutedText}>
                  Games won
                </Text>
                <Title order={3} style={{ lineHeight: 1 }}>
                  {player.games}
                </Title>
              </div>
            </Group>
          </div>
          {doublesMode && (
            <Stack gap="xs">
              <Group justify="space-between" align="center">
                <Text size="sm" c={mutedText}>
                  Teammate lineup
                </Text>
                {player.teammates.length > 1 && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="teal"
                    onClick={() => onSwapTeammates(player.id)}
                  >
                    Switch positions
                  </Button>
                )}
              </Group>
              {player.teammates.map((teammate) => (
                <Group key={`${teammate.id}-${teammate.name}`} gap="xs" align="flex-end">
                  <TextInput
                    defaultValue={teammate.name}
                    spellCheck={false}
                    maxLength={24}
                    size="xs"
                    flex={1}
                    onBlur={(event: FocusEvent<HTMLInputElement>) =>
                      onTeammateNameChange(
                        player.id,
                        teammate.id,
                        event.currentTarget.value,
                      )
                    }
                  />
                  <SavedNamesMenu
                    savedNames={savedNames}
                    actionSize="sm"
                    iconSize={14}
                    tooltipLabel="Saved names"
                    menuPosition="bottom-end"
                    onApply={(name) =>
                      onTeammateNameChange(player.id, teammate.id, name)
                    }
                    onSave={() => onSaveTeammateName(player.id, teammate.id)}
                    onClear={() => onTeammateNameChange(player.id, teammate.id, '')}
                    saveLabel={`Save “${teammate.name || player.name}”`}
                    clearLabel="Clear teammate name"
                  />
                </Group>
              ))}
            </Stack>
          )}
          <Group gap="xs" grow>
            <Button
              variant="light"
              color="gray"
              size="lg"
              onClick={() => onPointChange(player.id, -1)}
              disabled={player.points === 0}
            >
              -1
            </Button>
            <Button
              size="lg"
              color="teal"
              onClick={() => onPointChange(player.id, 1)}
              disabled={!matchIsLive}
            >
              +1
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Card>
  )
}
