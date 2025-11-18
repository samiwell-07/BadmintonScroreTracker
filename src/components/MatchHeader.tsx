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
import type { Translations } from '../i18n/translations'

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
  t: Translations
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
  t,
}: MatchHeaderProps) => (
  <Card withBorder radius="lg" p="xl" style={{ backgroundColor: cardBg }} shadow="lg">
    <Stack gap="md">
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
        <div style={{ flex: 1, minWidth: '16rem' }}>
          <Title order={2}>{t.app.headerTitle}</Title>
          <Stack gap={4} mt="xs">
            {t.app.descriptionLines.map((line) => (
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
              {scoreOnlyMode ? t.header.scoreOnlyActive : t.header.scoreOnlyInactive}
            </Button>
            <Button
              variant={simpleScoreMode ? 'filled' : 'light'}
              color={simpleScoreMode ? 'teal' : 'gray'}
              onClick={onToggleSimpleScore}
              aria-pressed={simpleScoreMode}
              style={{ flex: 1, minWidth: '8rem' }}
            >
              {simpleScoreMode ? t.header.simpleActive : t.header.simpleInactive}
            </Button>
          </Group>
          <Group gap="sm" wrap="wrap" justify="flex-end">
            <Tooltip label={t.header.colorSchemeTooltip}>
              <ActionIcon
                variant="outline"
                size="lg"
                onClick={onToggleColorMode}
                aria-label={t.header.colorSchemeAriaLabel}
              >
                {colorScheme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t.header.languageTooltip}>
              <Button variant="light" onClick={onToggleLanguage}>
                {language === 'en' ? 'FR' : 'EN'}
              </Button>
            </Tooltip>
            <Tooltip label={t.header.undoTooltip}>
              <Button
                variant="light"
                leftSection={<IconArrowBackUp size={18} />}
                onClick={onUndo}
                disabled={!canUndo}
              >
                {t.header.undo}
              </Button>
            </Tooltip>
          </Group>
        </Stack>
      </Group>
    </Stack>
  </Card>
)
