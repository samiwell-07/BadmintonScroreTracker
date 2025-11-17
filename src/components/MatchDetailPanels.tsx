import type { MatchState } from '../types/match'
import { MatchSettingsCard } from './MatchSettingsCard'
import { MatchControlsCard } from './MatchControlsCard'
import { MatchInsightsCard } from './MatchInsightsCard'
import { GameHistoryCard } from './GameHistoryCard'

interface MatchDetailPanelsProps {
  cardBg: string
  mutedText: string
  match: MatchState
  gamesNeeded: number
  matchIsLive: boolean
  elapsedMs: number
  onRaceToChange: (value: number) => void
  onBestOfChange: (bestOf: MatchState['bestOf']) => void
  onWinByTwoToggle: (checked: boolean) => void
  onDoublesToggle: (checked: boolean) => void
  onSwapEnds: () => void
  onToggleServer: () => void
  onResetGame: () => void
  onResetMatch: () => void
  onToggleClock: () => void
  onClearHistory: () => void
}

export const MatchDetailPanels = ({
  cardBg,
  mutedText,
  match,
  gamesNeeded,
  matchIsLive,
  elapsedMs,
  onRaceToChange,
  onBestOfChange,
  onWinByTwoToggle,
  onDoublesToggle,
  onSwapEnds,
  onToggleServer,
  onResetGame,
  onResetMatch,
  onToggleClock,
  onClearHistory,
}: MatchDetailPanelsProps) => (
  <>
    <MatchSettingsCard
      cardBg={cardBg}
      mutedText={mutedText}
      match={match}
      onRaceToChange={onRaceToChange}
      onBestOfChange={onBestOfChange}
      onWinByTwoToggle={onWinByTwoToggle}
      onDoublesToggle={onDoublesToggle}
    />

    <MatchControlsCard
      cardBg={cardBg}
      onSwapEnds={onSwapEnds}
      onToggleServer={onToggleServer}
      onResetGame={onResetGame}
      onResetMatch={onResetMatch}
    />

    <MatchInsightsCard
      cardBg={cardBg}
      mutedText={mutedText}
      match={match}
      gamesNeeded={gamesNeeded}
      matchIsLive={matchIsLive}
      elapsedMs={elapsedMs}
      clockRunning={match.clockRunning}
      onToggleClock={onToggleClock}
    />

    <GameHistoryCard
      cardBg={cardBg}
      mutedText={mutedText}
      games={match.completedGames}
      onClearHistory={onClearHistory}
    />
  </>
)
