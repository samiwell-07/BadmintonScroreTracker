import type { MatchState } from '../../types/match'

export const createFreshClockState = () => ({
  clockRunning: true,
  clockStartedAt: Date.now(),
  clockElapsedMs: 0,
})

export const getLiveElapsedMs = (state: MatchState) =>
  state.clockElapsedMs +
  (state.clockRunning && state.clockStartedAt ? Date.now() - state.clockStartedAt : 0)
