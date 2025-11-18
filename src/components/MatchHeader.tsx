import {
  ActionIcon,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
  type MantineColorScheme,
} from '@mantine/core'
import { IconArrowBackUp, IconMoon, IconSun } from '@tabler/icons-react'

interface MatchHeaderProps {
  cardBg: string
  mutedText: string
  onUndo: () => void
  onToggleColorMode: () => void
  colorScheme: MantineColorScheme
  canUndo: boolean
  scoreOnlyMode: boolean
  onToggleScoreOnly: () => void
  simpleScoreMode: boolean
  onToggleSimpleScore: () => void
  language: 'en' | 'fr'
  onToggleLanguage: () => void
}

export const MatchHeader = ({
  cardBg,
  mutedText,
  onUndo,
  onToggleColorMode,
  colorScheme,
  canUndo,
  scoreOnlyMode,
  onToggleScoreOnly,
  simpleScoreMode,
  onToggleSimpleScore,
  language,
  onToggleLanguage,
}: MatchHeaderProps) => (
  <Card withBorder radius="lg" p="xl" style={{ backgroundColor: cardBg }} shadow="lg">
    <Stack gap="md">
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
        <div style={{ flex: 1, minWidth: '16rem' }}>
          <Title order={2}>
            {language === 'en' ? 'Badminton Score Tracker' : 'Suivi de score badminton'}
          </Title>
          <Stack gap={4} mt="xs">
            {(language === 'en'
              ? [
                  'Keep a responsive, offline-friendly record of every rally.',
                  'Scores stay on this device so you can resume anytime.',
                  'This application was created by Samuel Srouji.',
                ]
              : [
                  'Gardez une trace hors ligne et réactive de chaque échange.',
                  'Les scores restent sur cet appareil pour reprendre quand vous voulez.',
                  'Cette application a été créée par Samuel Srouji.',
                ]
            ).map((line) => (
              <Text key={line} c={mutedText}>
                {line}
              </Text>
            ))}
          </Stack>
        </div>
        <Stack gap="xs" align="stretch" style={{ minWidth: '12rem', width: '100%' }}>
          <Group gap="xs" grow wrap="wrap">
            <Button
              variant={scoreOnlyMode ? 'filled' : 'light'}
              color={scoreOnlyMode ? 'teal' : 'gray'}
              onClick={onToggleScoreOnly}
              aria-pressed={scoreOnlyMode}
              style={{ flex: 1, minWidth: '8rem' }}
            >
              {scoreOnlyMode
                ? language === 'en'
                  ? 'Show full view'
                  : 'Vue complète'
                : language === 'en'
                  ? 'Score-only view'
                  : 'Vue score uniquement'}
            </Button>
            <Button
              variant={simpleScoreMode ? 'filled' : 'light'}
              color={simpleScoreMode ? 'teal' : 'gray'}
              onClick={onToggleSimpleScore}
              aria-pressed={simpleScoreMode}
              style={{ flex: 1, minWidth: '8rem' }}
            >
              {simpleScoreMode
                ? language === 'en'
                  ? 'Show full view'
                  : 'Vue complète'
                : language === 'en'
                  ? 'Simple score view'
                  : 'Vue simple'}
            </Button>
          </Group>
          <Group gap="sm" wrap="wrap" justify="flex-end">
            <Tooltip label="Swap light / dark mode">
              <ActionIcon
                variant="outline"
                size="lg"
                onClick={onToggleColorMode}
                aria-label="Toggle color scheme"
              >
                {colorScheme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={language === 'en' ? 'Afficher en français' : 'Show in English'}
            >
              <Button variant="light" onClick={onToggleLanguage}>
                {language === 'en' ? 'FR' : 'EN'}
              </Button>
            </Tooltip>
            <Tooltip label="Undo last change">
              <Button
                variant="light"
                leftSection={<IconArrowBackUp size={18} />}
                onClick={onUndo}
                disabled={!canUndo}
              >
                {language === 'en' ? 'Undo' : 'Annuler'}
              </Button>
            </Tooltip>
          </Group>
        </Stack>
      </Group>
    </Stack>
  </Card>
)
