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
  const { controls, common } = t
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
        title={controls.resetPointsModalTitle}
      >
        <Stack gap="sm">
          <Text size="sm" c="dimmed">
            {controls.resetPointsModalBody}
          </Text>
          <Group gap="sm" justify="flex-end">
            <Button variant="subtle" onClick={closeResetGameModal}>
              {common.cancel}
            </Button>
            <Button color="red" onClick={handleConfirmResetGame}>
              {controls.resetPoints}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={resetMatchModalOpened}
        onClose={closeResetMatchModal}
        title={controls.resetMatchModalTitle}
      >
        <Stack gap="sm">
          <Text size="sm" c="dimmed">
            {controls.resetMatchModalBody}
          </Text>
          <Group gap="sm" justify="flex-end">
            <Button variant="subtle" onClick={closeResetMatchModal}>
              {common.cancel}
            </Button>
            <Button color="red" onClick={handleConfirmResetMatch}>
              {controls.startNewMatch}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Card mt="lg" withBorder radius="lg" p="xl" style={{ backgroundColor: cardBg }}>
        <Stack gap="lg">
          <Stack gap={4}>
            <Text size="sm" fw={600} c="dimmed">
              {controls.adjustPositionsHeading}
            </Text>
            <Group gap="sm" wrap="wrap">
              <Button variant="light" leftSection={<IconRepeat size={18} />} onClick={onSwapEnds}>
                {controls.swapEnds}
              </Button>
              <Button variant="light" onClick={onToggleServer}>
                {controls.toggleServer}
              </Button>
            </Group>
          </Stack>

          <Stack gap={4}>
            <Text size="sm" fw={600} c="dimmed">
              {controls.resetsHeading}
            </Text>
            <Group gap="sm" wrap="wrap">
              <Tooltip label={controls.resetPointsTooltip} withArrow>
                <Button variant="light" color="orange" onClick={openResetGameModal}>
                  {controls.resetPoints}
                </Button>
              </Tooltip>
              <Tooltip label={controls.resetMatchTooltip} withArrow>
                <Button color="red" onClick={openResetMatchModal}>
                  {controls.startNewMatch}
                </Button>
              </Tooltip>
            </Group>
          </Stack>
        </Stack>
      </Card>
    </>
  )
}
