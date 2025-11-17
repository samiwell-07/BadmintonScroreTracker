import { useState } from 'react'
import { Badge, Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import type { CompletedGame, PlayerId } from '../types/match'
import { formatDuration, formatRelativeTime } from '../utils/match'

interface GameHistoryCardProps {
  cardBg: string
  mutedText: string
  games: CompletedGame[]
  onClearHistory: () => void
}

export const GameHistoryCard = ({ cardBg, mutedText, games, onClearHistory }: GameHistoryCardProps) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Card mt="lg" withBorder radius="lg" p="xl" style={{ backgroundColor: cardBg }}>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={5}>Game history</Title>
            <Text size="sm" c={mutedText}>
              {games.length === 0
                ? 'Completed games will appear here.'
                : `Showing last ${games.length} ${games.length === 1 ? 'game' : 'games'}.`}
            </Text>
          </div>
          <Group gap="xs">
            <Button size="xs" variant="subtle" onClick={() => setCollapsed((value) => !value)}>
              {collapsed ? 'Show history' : 'Close history'}
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              disabled={games.length === 0}
              onClick={onClearHistory}
            >
              Erase history
            </Button>
          </Group>
        </Group>
        {collapsed ? (
          <Text size="sm" c={mutedText}>
            History hidden. Use “Show history” to view completed games.
          </Text>
        ) : games.length === 0 ? (
          <Text c={mutedText}>Finish a game to build your history timeline.</Text>
        ) : (
          <Stack gap="sm">
            {games.map((game) => {
              const lineup: PlayerId[] = ['playerA', 'playerB']
              return (
                <Card key={game.id} withBorder radius="md" p="md" shadow="sm">
                  <Stack gap={4}>
                    <Group justify="space-between" wrap="wrap" gap="xs">
                      <Text size="sm" fw={600}>
                        Game {game.number}
                      </Text>
                      <Text size="xs" c={mutedText}>
                        {formatRelativeTime(game.timestamp)}
                      </Text>
                    </Group>
                    <Group gap="xs" wrap="wrap">
                      <Badge color="teal" variant="light">
                        Winner · {game.winnerName}
                      </Badge>
                      <Badge color="gray" variant="light">
                        {formatDuration(game.durationMs)}
                      </Badge>
                      {lineup.map((playerId, index) => {
                        const score = game.scores[playerId]
                        if (!score) {
                          return null
                        }
                        const badgeColor = index === 0 ? 'blue' : 'grape'
                        return (
                          <Badge key={playerId} color={badgeColor} variant="light">
                            {score.name}: {score.points}
                          </Badge>
                        )
                      })}
                    </Group>
                  </Stack>
                </Card>
              )
            })}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}
