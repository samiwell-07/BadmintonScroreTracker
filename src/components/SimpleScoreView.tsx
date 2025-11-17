import { Box, Button, Card, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import type { PlayerId, PlayerState } from '../types/match'

interface SimpleScoreViewProps {
  players: PlayerState[]
  cardBg: string
  mutedText: string
  matchIsLive: boolean
  onPointChange: (playerId: PlayerId, delta: number) => void
  onExit: () => void
}

export const SimpleScoreView = ({
  players,
  cardBg,
  mutedText,
  matchIsLive,
  onPointChange,
  onExit,
}: SimpleScoreViewProps) => (
  <Stack gap="lg" align="center">
    <Button size="sm" color="teal" onClick={onExit}>
      Show full view
    </Button>
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" w="100%">
      {players.map((player) => (
        <Card key={player.id} radius="lg" withBorder shadow="lg" p="xl" style={{ backgroundColor: cardBg }}>
          <Stack gap="md" align="center">
            <Text size="lg" fw={600}>
              {player.name}
            </Text>
            <Title order={1} style={{ fontSize: '4rem', lineHeight: 1 }}>
              {player.points}
            </Title>
            <Box style={{ display: 'flex', gap: '0.75rem' }}>
              <Button
                variant="light"
                color="gray"
                size="lg"
                disabled={player.points === 0}
                onClick={() => onPointChange(player.id, -1)}
              >
                -1
              </Button>
              <Button
                size="lg"
                color="teal"
                disabled={!matchIsLive}
                onClick={() => onPointChange(player.id, 1)}
              >
                +1
              </Button>
            </Box>
            <Text size="sm" c={mutedText}>
              Tap the buttons to adjust score.
            </Text>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  </Stack>
)
