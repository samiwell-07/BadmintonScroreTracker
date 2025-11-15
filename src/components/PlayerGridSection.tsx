import { SimpleGrid } from '@mantine/core'
import type { PlayerId, PlayerState } from '../types/match'
import type { MatchConfig } from '../utils/match'
import { PlayerScoreCard } from './PlayerScoreCard'

interface PlayerGridSectionProps {
  players: PlayerState[]
  cardBg: string
  mutedText: string
  server: PlayerId
  matchWinner: PlayerId | null
  gamesNeeded: number
  matchConfig: MatchConfig
  matchIsLive: boolean
  savedNames: string[]
  onNameChange: (playerId: PlayerId, name: string) => void
  onPointChange: (playerId: PlayerId, delta: number) => void
  onApplySavedName: (playerId: PlayerId, name: string) => void
  onSaveName: (playerId: PlayerId) => void
}

export const PlayerGridSection = ({
  players,
  cardBg,
  mutedText,
  server,
  matchWinner,
  gamesNeeded,
  matchConfig,
  matchIsLive,
  savedNames,
  onNameChange,
  onPointChange,
  onApplySavedName,
  onSaveName,
}: PlayerGridSectionProps) => (
  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
    {players.map((player, index) => {
      const opponent = players[(index + 1) % players.length]
      const isServer = server === player.id

      return (
        <PlayerScoreCard
          key={`${player.id}-${player.name}`}
          player={player}
          opponent={opponent}
          cardBg={cardBg}
          mutedText={mutedText}
          isServer={isServer}
          matchWinner={matchWinner}
          gamesNeeded={gamesNeeded}
          matchConfig={matchConfig}
          matchIsLive={matchIsLive}
          savedNames={savedNames}
          onNameChange={onNameChange}
          onPointChange={onPointChange}
          onApplySavedName={onApplySavedName}
          onSaveName={onSaveName}
        />
      )
    })}
  </SimpleGrid>
)
