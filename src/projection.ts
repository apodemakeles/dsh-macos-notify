/**
 * The `turn-notify` session projection: a pure fold that remembers the last
 * ended turn and its `turn/end` reason. The projection seam replays every
 * committed event and delivers the wire view to the client for every session,
 * so the browser can distinguish completed / error / aborted without a route
 * or a second event channel.
 */
import { z } from 'zod'
import { PROJECTION_KEY, type TurnNotifyProjectionValue } from './shared'

export interface TurnNotifyProjectionState {
  /** Turn currently open, null outside a turn. */
  openTurn: number | null
  /** Last ended turn, null before the first one. */
  last: TurnNotifyProjectionValue | null
}

interface SessionEventLike {
  type: string
  data?: {
    turn?: number
    reason?: { kind?: string }
  }
}

const valueSchema = z.object({
  turn: z.number().int().nonnegative(),
  reason: z.string(),
}).strict()

const stateSchema = z.object({
  openTurn: z.number().int().nonnegative().nullable(),
  last: valueSchema.nullable(),
}).strict()

export const EMPTY_PROJECTION: TurnNotifyProjectionValue = Object.freeze({
  turn: 0,
  reason: '',
})

/**
 * Apply one committed session event. Uninteresting events return the same
 * state reference so the projection drive publishes nothing.
 */
export function applyProjectionEvent(
  state: TurnNotifyProjectionState,
  event: SessionEventLike,
): TurnNotifyProjectionState {
  const turn = event.data?.turn
  if (typeof turn !== 'number' || !Number.isSafeInteger(turn) || turn < 0) return state
  switch (event.type) {
    case 'turn/start':
      return { ...state, openTurn: turn }
    case 'turn/end':
      if (state.openTurn === null || state.openTurn !== turn) return state
      return {
        openTurn: null,
        last: { turn, reason: event.data?.reason?.kind ?? '' },
      }
    default:
      return state
  }
}

/** Build the projection unit registered on `ctx.sessionProjections`. */
export function turnNotifyProjection() {
  return {
    key: PROJECTION_KEY,
    stateSchema,
    init: (): TurnNotifyProjectionState => ({ openTurn: null, last: null }),
    apply: applyProjectionEvent,
    wire: {
      viewSchema: valueSchema,
      view: (state: TurnNotifyProjectionState): TurnNotifyProjectionValue => state.last ?? EMPTY_PROJECTION,
    },
    stateVersion: 1,
  }
}
