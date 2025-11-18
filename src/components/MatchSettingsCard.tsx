import {
  Card,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import { type ChangeEvent } from 'react'
import type { MatchState } from '../types/match'
import { BEST_OF_OPTIONS } from '../types/match'
import type { Translations } from '../i18n/translations'

interface MatchSettingsCardProps {
  cardBg: string
  mutedText: string
  match: MatchState
  onRaceToChange: (value: number) => void
  onBestOfChange: (value: MatchState['bestOf']) => void
  onWinByTwoToggle: (checked: boolean) => void
  onDoublesToggle: (checked: boolean) => void
  t: Translations
}

export const MatchSettingsCard = ({
  cardBg,
  mutedText,
  match,
  onRaceToChange,
  onBestOfChange,
  onWinByTwoToggle,
  onDoublesToggle,
  t,
}: MatchSettingsCardProps) => (
  <Card mt="lg" withBorder radius="lg" p="xl" style={{ backgroundColor: cardBg }}>
    <Stack gap="lg">
      <Title order={4}>{t.settings.title}</Title>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        <Stack gap="xs">
          <Text size="sm" c={mutedText}>
            {t.settings.raceToLabel}
          </Text>
          <NumberInput
            min={11}
            max={match.maxPoint}
            value={match.raceTo}
            allowDecimal={false}
            onChange={(value: string | number) => {
              const numeric = typeof value === 'number' ? value : Number(value)
              onRaceToChange(numeric)
            }}
          />
        </Stack>
        <Stack gap="xs">
          <Text size="sm" c={mutedText}>
            {t.settings.matchLengthLabel}
          </Text>
          <Select
            data={BEST_OF_OPTIONS.map((option) => ({
              value: option.toString(),
              label: t.settings.bestOfOption(option),
            }))}
            value={match.bestOf.toString()}
            onChange={(value: string | null) => {
              if (!value) return
              onBestOfChange(Number(value) as MatchState['bestOf'])
            }}
          />
        </Stack>
        <Stack gap="xs">
          <Text size="sm" c={mutedText}>
            {t.settings.winByTwoLabel}
          </Text>
          <Switch
            checked={match.winByTwo}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onWinByTwoToggle(event.currentTarget.checked)
            }
            label={match.winByTwo ? t.settings.winByTwoEnabled : t.settings.winByTwoDisabled}
          />
        </Stack>
        <Stack gap="xs">
          <Text size="sm" c={mutedText}>
            {t.settings.doublesLabel}
          </Text>
          <Switch
            checked={match.doublesMode}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onDoublesToggle(event.currentTarget.checked)
            }
            label={match.doublesMode ? t.settings.doublesEnabled : t.settings.doublesDisabled}
          />
        </Stack>
      </SimpleGrid>
    </Stack>
  </Card>
)
