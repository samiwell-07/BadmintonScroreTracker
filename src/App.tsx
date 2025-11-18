import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Container, Stack } from '@mantine/core'
import { MatchHeader } from './components/MatchHeader'
import { PlayerGridSection } from './components/PlayerGridSection'
import { ScoreOnlyOverlays } from './components/ScoreOnlyOverlays'
import { useMatchController } from './hooks/useMatchController'
import { useThemeColors } from './hooks/useThemeColors'
import type { MatchState } from './types/match'
import type { MatchConfig } from './utils/match'
import { translations, type Language } from './i18n/translations'
const STORAGE_KEYS = {
  scoreOnly: 'scoreOnlyMode',
  simpleScore: 'simpleScoreMode',
  language: 'bst-language',
} as const

const readStoredBoolean = (key: string, fallback = false) => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === 'true') return true
    if (raw === 'false') return false
    return fallback
  } catch {
    return fallback
  }
}

const readStoredLanguage = () => {
  if (typeof window === 'undefined') return 'en'
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.language)
    if (raw === 'en' || raw === 'fr') {
      return raw
    }
  } catch {
    // ignore
  }
  if (typeof navigator !== 'undefined') {
    return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
  }
  return 'en'
}

const useDebouncedBooleanStorage = (key: string, value: boolean, delay = 200) => {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handle = window.setTimeout(() => {
      try {
        window.localStorage.setItem(key, value ? 'true' : 'false')
      } catch {
        /* ignore storage issues */
      }
    }, delay)
    return () => window.clearTimeout(handle)
  }, [key, value, delay])
}

const useDebouncedStringStorage = (key: string, value: string, delay = 200) => {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handle = window.setTimeout(() => {
      try {
        window.localStorage.setItem(key, value)
      } catch {
        /* ignore storage issues */
      }
    }, delay)
    return () => window.clearTimeout(handle)
  }, [key, value, delay])
}

const MatchDetailPanels = lazy(() =>
  import('./components/MatchDetailPanels').then(({ MatchDetailPanels }) => ({
    default: MatchDetailPanels,
  })),
)
const DoublesCourtDiagram = lazy(() =>
  import('./components/DoublesCourtDiagram').then(({ DoublesCourtDiagram }) => ({
    default: DoublesCourtDiagram,
  })),
)
const SimpleScoreView = lazy(() =>
  import('./components/SimpleScoreView').then(({ SimpleScoreView }) => ({
    default: SimpleScoreView,
  })),
)

function App() {
  const { match, history, gamesNeeded, matchIsLive, actions } = useMatchController()
  const { colorScheme, pageBg, cardBg, mutedText, toggleColorMode } = useThemeColors()
  const [language, setLanguage] = useState<Language>(() => readStoredLanguage())
  const [scoreOnlyMode, setScoreOnlyMode] = useState(() =>
    readStoredBoolean(STORAGE_KEYS.scoreOnly),
  )
  const [simpleScoreMode, setSimpleScoreMode] = useState(() =>
    readStoredBoolean(STORAGE_KEYS.simpleScore),
  )
  const {
    handleNameChange,
    handlePointChange,
    handleUndo,
    handleResetGame,
    handleResetMatch,
    handleSwapEnds,
    handleServerToggle,
    handleSetServer,
    handleTeammateNameChange,
    handleDoublesModeToggle,
    handleSavePlayerName,
    handleSaveTeammateName,
    handleApplySavedName,
    handleClockToggle,
    handleSwapTeammates,
    handleClearHistory,
    pushUpdate,
  } = actions

  useDebouncedStringStorage(STORAGE_KEYS.language, language)
  useDebouncedBooleanStorage(STORAGE_KEYS.scoreOnly, scoreOnlyMode)
  useDebouncedBooleanStorage(STORAGE_KEYS.simpleScore, simpleScoreMode)

  const matchConfig: MatchConfig = useMemo(
    () => ({
      raceTo: match.raceTo,
      maxPoint: match.maxPoint,
      winByTwo: match.winByTwo,
    }),
    [match.maxPoint, match.raceTo, match.winByTwo],
  )

  const handleScoreOnlyToggle = useCallback(() => {
    setScoreOnlyMode((previous) => {
      const next = !previous
      if (next) {
        setSimpleScoreMode(false)
      }
      return next
    })
  }, [])

  const handleSimpleScoreToggle = useCallback(() => {
    setSimpleScoreMode((previous) => {
      const next = !previous
      if (next) {
        setScoreOnlyMode(false)
      }
      return next
    })
  }, [])

  const handleLanguageToggle = useCallback(() => {
    setLanguage((current) => (current === 'en' ? 'fr' : 'en'))
  }, [])

  const t = useMemo(() => translations[language], [language])

  const [displayElapsedMs, setDisplayElapsedMs] = useState(match.clockElapsedMs)

  useEffect(() => {
    document.title = language === 'en' ? 'Badminton Score Tracker' : 'Suivi de score badminton'
  }, [language])

  useEffect(() => {
    if (!match.clockRunning || !match.clockStartedAt) {
      setDisplayElapsedMs(match.clockElapsedMs)
      return
    }

    const startOffset = match.clockElapsedMs
    const startedAt = match.clockStartedAt

    const update = () => {
      setDisplayElapsedMs(startOffset + (Date.now() - startedAt))
    }

    update()
    const intervalId = window.setInterval(update, 1000)
    return () => window.clearInterval(intervalId)
  }, [match.clockRunning, match.clockStartedAt, match.clockElapsedMs])

  const handleRaceToChange = useCallback(
    (value: number) => {
      pushUpdate((state) => ({
        ...state,
        raceTo:
          !value || Number.isNaN(value) || value < 11
            ? 21
            : Math.min(value, state.maxPoint),
      }))
    },
    [pushUpdate],
  )

  const handleBestOfChange = useCallback(
    (nextBestOf: MatchState['bestOf']) => {
      pushUpdate((state) => {
        const nextGamesNeeded = Math.ceil(nextBestOf / 2)
        const updatedPlayers = state.players.map((player) => ({
          ...player,
          games: Math.min(player.games, nextGamesNeeded),
        }))
        const pendingWinner =
          updatedPlayers.find((player) => player.games >= nextGamesNeeded)?.id ?? null

        return {
          ...state,
          bestOf: nextBestOf,
          players: updatedPlayers,
          matchWinner: pendingWinner,
        }
      })
    },
    [pushUpdate],
  )

  const handleWinByTwoToggle = useCallback(
    (checked: boolean) => {
      pushUpdate((state) => ({
        ...state,
        winByTwo: checked,
      }))
    },
    [pushUpdate],
  )

  if (simpleScoreMode) {
    return (
      <Box
        style={{ minHeight: '100vh', backgroundColor: pageBg, paddingInline: '0.75rem' }}
      >
        <Container size="md" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
          <Suspense fallback={<Stack gap="xs">Loading score view…</Stack>}>
            <SimpleScoreView
              players={match.players}
              cardBg={cardBg}
              mutedText={mutedText}
              matchIsLive={matchIsLive}
              onPointChange={handlePointChange}
              onExit={() => setSimpleScoreMode(false)}
            />
          </Suspense>
        </Container>
      </Box>
    )
  }

  return (
    <Box
      style={{ minHeight: '100vh', backgroundColor: pageBg, paddingInline: '0.75rem' }}
    >
      <Container size="lg" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
        <Stack gap="lg">
          {!scoreOnlyMode && (
            <MatchHeader
              cardBg={cardBg}
              mutedText={mutedText}
              onUndo={handleUndo}
              onToggleColorMode={toggleColorMode}
              colorScheme={colorScheme}
              canUndo={history.length > 0}
              scoreOnlyMode={scoreOnlyMode}
              onToggleScoreOnly={handleScoreOnlyToggle}
              simpleScoreMode={simpleScoreMode}
              onToggleSimpleScore={handleSimpleScoreToggle}
              language={language}
              onToggleLanguage={handleLanguageToggle}
            />
          )}
          <PlayerGridSection
            players={match.players}
            cardBg={cardBg}
            mutedText={mutedText}
            server={match.server}
            matchWinner={match.matchWinner}
            gamesNeeded={gamesNeeded}
            matchConfig={matchConfig}
            matchIsLive={matchIsLive}
            savedNames={match.savedNames}
            doublesMode={match.doublesMode}
            teammateServerMap={match.teammateServerMap}
            onNameChange={handleNameChange}
            onPointChange={handlePointChange}
            onApplySavedName={handleApplySavedName}
            onSaveName={handleSavePlayerName}
            onTeammateNameChange={handleTeammateNameChange}
            onSaveTeammateName={handleSaveTeammateName}
            onSwapTeammates={handleSwapTeammates}
          />

          {match.doublesMode && (
            <Suspense fallback={<Stack gap="xs">Loading doubles diagram…</Stack>}>
              <DoublesCourtDiagram
                players={match.players}
                server={match.server}
                cardBg={cardBg}
                mutedText={mutedText}
                teammateServerMap={match.teammateServerMap}
              />
            </Suspense>
          )}

          {!scoreOnlyMode && (
            <Suspense fallback={<Stack gap="xs">Loading match details…</Stack>}>
              <MatchDetailPanels
                cardBg={cardBg}
                mutedText={mutedText}
                match={match}
                gamesNeeded={gamesNeeded}
                matchIsLive={matchIsLive}
                elapsedMs={displayElapsedMs}
                onRaceToChange={handleRaceToChange}
                onBestOfChange={handleBestOfChange}
                onWinByTwoToggle={handleWinByTwoToggle}
                onDoublesToggle={handleDoublesModeToggle}
                onSwapEnds={handleSwapEnds}
                onToggleServer={handleServerToggle}
                onResetGame={handleResetGame}
                onResetMatch={handleResetMatch}
                onToggleClock={handleClockToggle}
                onClearHistory={handleClearHistory}
                 t={t}
              />
            </Suspense>
          )}

          <ScoreOnlyOverlays
            active={scoreOnlyMode && !simpleScoreMode}
            mutedText={mutedText}
            players={match.players}
            server={match.server}
            doublesMode={match.doublesMode}
            teammateServerMap={match.teammateServerMap}
            onExitScoreOnly={handleScoreOnlyToggle}
            onSetServer={handleSetServer}
            onToggleServer={handleServerToggle}
          />
        </Stack>
      </Container>
    </Box>
  )
}

export default App
