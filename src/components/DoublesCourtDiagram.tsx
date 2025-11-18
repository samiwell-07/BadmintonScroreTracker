import { memo } from 'react'
import { Box, Paper, Stack, Text } from '@mantine/core'
import type { PlayerId, PlayerState, TeammateState } from '../types/match'

interface DoublesCourtDiagramProps {
  players: PlayerState[]
  server: PlayerId
  cardBg: string
  mutedText: string
  teammateServerMap: Record<PlayerId, string>
}

type CourtSide = 'left' | 'right'
type Lane = 'top' | 'bottom'

const COURT_HEIGHT = 280
const LANE_VERTICAL_PADDING = 18

const getServiceBox = (points: number): CourtSide => (points % 2 === 0 ? 'right' : 'left')

const getLaneForSide = (serviceBox: CourtSide, isLeftSide: boolean): Lane => {
  if (isLeftSide) {
    return serviceBox === 'right' ? 'bottom' : 'top'
  }
  return serviceBox === 'right' ? 'top' : 'bottom'
}

const flipLane: Record<Lane, Lane> = {
  top: 'bottom',
  bottom: 'top',
}

const getLaneAssignments = (
  team: PlayerState,
  serverMap: Record<PlayerId, string>,
  isLeftSide: boolean,
): { top: TeammateState | null; bottom: TeammateState | null } => {
  const teammates = team.teammates
  if (teammates.length === 0) {
    return { top: null, bottom: null }
  }

  const currentRightId = serverMap[team.id] ?? teammates[0]?.id
  const rightMate = teammates.find((mate) => mate.id === currentRightId) ?? teammates[0]
  const leftMate = teammates.find((mate) => mate.id !== rightMate.id) ?? rightMate

  return isLeftSide
    ? { top: leftMate, bottom: rightMate }
    : { top: rightMate, bottom: leftMate }
}

const DoublesCourtDiagramComponent = ({
  players,
  server,
  cardBg,
  mutedText,
  teammateServerMap,
}: DoublesCourtDiagramProps) => {
  const leftTeam = players[0]
  const rightTeam = players[1]
  if (!leftTeam || !rightTeam) {
    return null
  }

  const serverTeam = players.find((player) => player.id === server) ?? leftTeam
  const serverOnLeft = serverTeam.id === leftTeam.id

  const serverBox = getServiceBox(serverTeam.points)
  const serverLane = getLaneForSide(serverBox, serverOnLeft)
  const receiverLane = flipLane[serverLane]
  const columns = [
    {
      team: leftTeam,
      role: serverOnLeft ? ('server' as const) : ('receiver' as const),
      highlightLane: serverOnLeft ? serverLane : receiverLane,
    },
    {
      team: rightTeam,
      role: serverOnLeft ? ('receiver' as const) : ('server' as const),
      highlightLane: serverOnLeft ? receiverLane : serverLane,
    },
  ]

  return (
    <Paper withBorder radius="lg" p="lg" style={{ backgroundColor: cardBg }}>
      <Stack gap="xs">
        <Box
          style={{
            position: 'relative',
            border: '2px solid #adb5bd',
            borderRadius: '0.75rem',
            height: COURT_HEIGHT,
            overflow: 'hidden',
          }}
        >
          <Box style={{ display: 'flex', height: '100%' }}>
            {columns.map((column, columnIndex) => (
              <Box
                key={column.team.id}
                style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateRows: 'repeat(2, 1fr)',
                  borderRight:
                    columnIndex === 0 ? '1px solid rgba(173, 181, 189, 0.7)' : 'none',
                }}
              >
                {(['top', 'bottom'] as Lane[]).map((lane) => {
                  const isServerLane =
                    column.role === 'server' && lane === column.highlightLane
                  const isReceiverLane =
                    column.role === 'receiver' && lane === column.highlightLane

                  const laneAssignments = getLaneAssignments(
                    column.team,
                    teammateServerMap,
                    column.team.id === leftTeam.id,
                  )
                  const laneMate =
                    (lane === 'top' ? laneAssignments.top : laneAssignments.bottom) ??
                    null
                  const displayName =
                    laneMate && laneMate.name.length > 0
                      ? laneMate.name
                      : column.team.name
                  return (
                    <Box
                      key={`${column.team.id}-${lane}`}
                      style={{
                        borderBottom: lane === 'top' ? '1px solid #ced4da' : 'none',
                        backgroundColor: isServerLane
                          ? 'rgba(18, 184, 134, 0.2)'
                          : isReceiverLane
                            ? 'rgba(134, 142, 150, 0.25)'
                            : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        paddingBlock: LANE_VERTICAL_PADDING,
                      }}
                    >
                      <Stack gap={2} align="center">
                        <Box
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            width: '100%',
                          }}
                        >
                          <Text
                            size="xs"
                            fw={700}
                            c={isServerLane ? 'teal' : mutedText}
                            style={{
                              letterSpacing: 0.2,
                              textAlign: 'center',
                              flex: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {displayName}
                          </Text>
                        </Box>
                        {(isServerLane || isReceiverLane) && (
                          <Text size="8px" c={isServerLane ? 'teal' : mutedText}>
                            {isServerLane ? 'SERVE' : 'RECV'}
                          </Text>
                        )}
                      </Stack>
                    </Box>
                  )
                })}
              </Box>
            ))}
          </Box>
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: 8,
              height: '100%',
              transform: 'translateX(-50%)',
              backgroundColor: '#868e96',
            }}
          />
        </Box>
      </Stack>
    </Paper>
  )
}

export const DoublesCourtDiagram = memo(DoublesCourtDiagramComponent)
DoublesCourtDiagram.displayName = 'DoublesCourtDiagram'
