import { useDisclosure } from '@mantine/hooks'
import { Button, Card, Group, Modal, Stack, Text, Tooltip } from '@mantine/core'
import { IconRepeat } from '@tabler/icons-react'
import type { Translations } from '../i18n/translations'

interface MatchControlsCardProps {
  cardBg: string
  onSwapEnds: () => void
  onToggleServer: () => void
  onResetGame: () => void
  onResetMatch: () => void
  t: Translations
}

export const MatchControlsCard = ({
  cardBg,
  onSwapEnds,
  onToggleServer,
  onResetGame,
  onResetMatch,
  t,
}: MatchControlsCardProps) => {
  const [resetGameModalOpened, { open: openResetGameModal, close: closeResetGameModal }] =
    useDisclosure(false)
  const [resetMatchModalOpened, { open: openResetMatchModal, close: closeResetMatchModal }] =
    useDisclosure(false)

  const handleConfirmResetGame = () => {
    onResetGame()
    closeResetGameModal()
  }

  const handleConfirmResetMatch = () => {
    onResetMatch()
    closeResetMatchModal()
  }

  return (
    <>
      <Modal
        opened={resetGameModalOpened}
        onClose={closeResetGameModal}
        title={t.resetPointsModalTitle}
      >
        <Stack gap="sm">
          <Text size="sm" c="dimmed">
            {t.resetPointsModalBody}
          </Text>
          <Group gap="sm" justify="flex-end">
            <Button variant="subtle" onClick={closeResetGameModal}>
              {t.cancel}
            </Button>
            <Button color="red" onClick={handleConfirmResetGame}>
              {t.resetPoints}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={resetMatchModalOpened}
        onClose={closeResetMatchModal}
        title={t.resetMatchModalTitle}
      >
        <Stack gap="sm">
          <Text size="sm" c="dimmed">
            {t.resetMatchModalBody}
          </Text>
          <Group gap="sm" justify="flex-end">
            <Button variant="subtle" onClick={closeResetMatchModal}>
              {t.cancel}
            </Button>
            <Button color="red" onClick={handleConfirmResetMatch}>
              {t.startNewMatch}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Card mt="lg" withBorder radius="lg" p="xl" style={{ backgroundColor: cardBg }}>
        <Stack gap="lg">
          <Stack gap={4}>
            <Text size="sm" fw={600} c="dimmed">
              {t.adjustPositionsHeading}
            </Text>
            <Group gap="sm" wrap="wrap">
              <Button variant="light" leftSection={<IconRepeat size={18} />} onClick={onSwapEnds}>
                {t.swapEnds}
              </Button>
              <Button variant="light" onClick={onToggleServer}>
                {t.toggleServer}
              </Button>
            </Group>
          </Stack>

          <Stack gap={4}>
            <Text size="sm" fw={600} c="dimmed">
              {t.resetsHeading}
            </Text>
            <Group gap="sm" wrap="wrap">
              <Tooltip label={t.resetPointsTooltip} withArrow>
                <Button variant="light" color="orange" onClick={openResetGameModal}>
                  {t.resetPoints}
                </Button>
              </Tooltip>
              <Tooltip label={t.resetMatchTooltip} withArrow>
                <Button color="red" onClick={openResetMatchModal}>
                  {t.startNewMatch}
                </Button>
              </Tooltip>
            </Group>
          </Stack>
        </Stack>
      </Card>
    </>
  )
}
