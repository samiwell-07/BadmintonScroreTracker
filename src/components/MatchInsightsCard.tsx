import { Badge, Button, Card, Divider, Group, Stack, Text, Title } from '@mantine/core'
import type { MatchState } from '../types/match'
import { formatDuration, formatRelativeTime } from '../utils/match'
import type { Translations } from '../i18n/translations'

interface MatchInsightsCardProps {
  cardBg: string
  mutedText: string
  match: MatchState
  gamesNeeded: number
  matchIsLive: boolean
  elapsedMs: number
  clockRunning: boolean
  onToggleClock: () => void
  t: Translations
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
  t,
}: MatchInsightsCardProps) => (
  <Card mt="lg" withBorder radius="lg" p="xl" style={{ backgroundColor: cardBg }}>
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={5}>{t.insights.title}</Title>
        <Button variant="light" onClick={onToggleClock}>
          {clockRunning ? t.insights.pauseClock : t.insights.resumeClock}
        </Button>
      </Group>
      <Stack gap={4}>
        <Text size="sm" c={mutedText}>
          {t.insights.duration}
        </Text>
        <Title order={3}>{formatDuration(elapsedMs)}</Title>
      </Stack>
      <Group gap="sm" wrap="wrap">
        <Badge color={matchIsLive ? 'green' : 'grape'} variant="light">
          {matchIsLive ? t.insights.live : t.insights.completed}
        </Badge>
        <Badge color="cyan" variant="light">
          {t.insights.bestOfBadge(match.bestOf)}
        </Badge>
        <Badge color="pink" variant="light">
          {t.insights.gamesNeededBadge(gamesNeeded)}
        </Badge>
        <Badge color="orange" variant="light">
          {t.insights.raceToBadge(match.raceTo)}
        </Badge>
        <Badge color="yellow" variant="light">
          {t.insights.updatedBadge(formatRelativeTime(match.lastUpdated, t.relativeTime))}
        </Badge>
      </Group>
      <Divider />
      <Text c={mutedText}>{t.insights.tip}</Text>
    </Stack>
  </Card>
)
