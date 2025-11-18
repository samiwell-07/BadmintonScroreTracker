import { memo, lazy, Suspense } from 'react'
import type { MatchState } from '../types/match'
import type { Translations } from '../i18n/translations'
import { MatchSettingsCard } from './MatchSettingsCard'
import { MatchControlsCard } from './MatchControlsCard'

const MatchInsightsCardLazy = lazy(() =>
  import('./MatchInsightsCard').then(({ MatchInsightsCard }) => ({
    default: MatchInsightsCard,
  })),
)

const GameHistoryCardLazy = lazy(() =>
  import('./GameHistoryCard').then(({ GameHistoryCard }) => ({
    default: GameHistoryCard,
  })),
)

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
  t: Translations
}

const MatchDetailPanelsComponent = ({
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
  t,
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
      t={t}
    />

    <MatchControlsCard
      cardBg={cardBg}
      onSwapEnds={onSwapEnds}
      onToggleServer={onToggleServer}
      onResetGame={onResetGame}
      onResetMatch={onResetMatch}
      t={t}
    />

    <Suspense fallback={null}>
      <MatchInsightsCardLazy
        cardBg={cardBg}
        mutedText={mutedText}
        match={match}
        gamesNeeded={gamesNeeded}
        matchIsLive={matchIsLive}
        elapsedMs={elapsedMs}
        clockRunning={match.clockRunning}
        onToggleClock={onToggleClock}
        t={t}
      />
    </Suspense>

    <Suspense fallback={null}>
      <GameHistoryCardLazy
        cardBg={cardBg}
        mutedText={mutedText}
        games={match.completedGames}
        onClearHistory={onClearHistory}
        t={t}
      />
    </Suspense>
  </>
)

export const MatchDetailPanels = memo(MatchDetailPanelsComponent)
MatchDetailPanels.displayName = 'MatchDetailPanels'
