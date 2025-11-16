import { ActionIcon, Menu, Tooltip } from '@mantine/core'
import type { ActionIconProps, MenuProps } from '@mantine/core'
import { IconBookmarkPlus, IconCircleX, IconUserCircle } from '@tabler/icons-react'

interface SavedNamesMenuProps {
  savedNames: string[]
  onApply: (name: string) => void
  onSave?: () => void
  onClear?: () => void
  tooltipLabel?: string
  actionSize?: ActionIconProps['size']
  iconSize?: number
  menuPosition?: MenuProps['position']
  menuWithinPortal?: boolean
  saveLabel?: string
  clearLabel?: string
}

export const SavedNamesMenu = ({
  savedNames,
  onApply,
  onSave,
  onClear,
  tooltipLabel = 'Saved names',
  actionSize = 'lg',
  iconSize = 18,
  menuPosition = 'bottom-end',
  menuWithinPortal = true,
  saveLabel = 'Save current name',
  clearLabel = 'Clear name',
}: SavedNamesMenuProps) => (
  <Menu withinPortal={menuWithinPortal} position={menuPosition} shadow="md">
    <Menu.Target>
      <Tooltip label={tooltipLabel}>
        <ActionIcon variant="light" size={actionSize}>
          <IconUserCircle size={iconSize} />
        </ActionIcon>
      </Tooltip>
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Label>Saved names</Menu.Label>
      {onClear && (
        <>
          <Menu.Item leftSection={<IconCircleX size={iconSize} />} onClick={onClear}>
            {clearLabel}
          </Menu.Item>
          {savedNames.length > 0 && <Menu.Divider />}
        </>
      )}
      {savedNames.length === 0 && <Menu.Item disabled>No saved names</Menu.Item>}
      {savedNames.map((name) => (
        <Menu.Item key={name} onClick={() => onApply(name)}>
          {name}
        </Menu.Item>
      ))}
      {onSave && (
        <>
          <Menu.Divider />
          <Menu.Item leftSection={<IconBookmarkPlus size={16} />} onClick={onSave}>
            {saveLabel}
          </Menu.Item>
        </>
      )}
    </Menu.Dropdown>
  </Menu>
)
