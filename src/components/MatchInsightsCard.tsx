import { Badge, Button, Card, Divider, Group, Stack, Text, Title } from '@mantine/core'
import type { MatchState } from '../types/match'
import { formatDuration, formatRelativeTime } from '../utils/match'

interface MatchInsightsCardProps {
  cardBg: string
  mutedText: string
  match: MatchState
  gamesNeeded: number
  matchIsLive: boolean
  elapsedMs: number
  clockRunning: boolean
  onToggleClock: () => void
}

export const MatchInsightsCard = ({
  cardBg,
  mutedText,
  match,
  gamesNeeded,
  matchIsLive,
  elapsedMs,
  clockRunning,
  onToggleClock,
}: MatchInsightsCardProps) => (
  <Card mt="lg" withBorder radius="lg" p="xl" style={{ backgroundColor: cardBg }}>
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={5}>Match insights</Title>
        <Button variant="light" onClick={onToggleClock}>
          {clockRunning ? 'Pause clock' : 'Resume clock'}
        </Button>
      </Group>
      <Stack gap={4}>
        <Text size="sm" c={mutedText}>
          Duration
        </Text>
        <Title order={3}>{formatDuration(elapsedMs)}</Title>
      </Stack>
      <Group gap="sm" wrap="wrap">
        <Badge color={matchIsLive ? 'green' : 'grape'} variant="light">
          {matchIsLive ? 'Live' : 'Completed'}
        </Badge>
        <Badge color="cyan" variant="light">
          Best of {match.bestOf}
        </Badge>
        <Badge color="pink" variant="light">
          Games needed {gamesNeeded}
        </Badge>
        <Badge color="orange" variant="light">
          Race to {match.raceTo}
        </Badge>
        <Badge color="yellow" variant="light">
          Updated {formatRelativeTime(match.lastUpdated)}
        </Badge>
      </Group>
      <Divider />
      <Text c={mutedText}>
        Tip: add the page to your home screen for a fast, offline-ready scoreboard during practice or tournaments.
      </Text>
    </Stack>
  </Card>
)
