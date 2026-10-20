import { describe, expect, it } from 'vitest'
import {
  EMPTY_PROJECTION,
  applyProjectionEvent,
  turnNotifyProjection,
  type TurnNotifyProjectionState,
} from '../src/projection'
import { PROJECTION_KEY } from '../src/shared'

const initial: TurnNotifyProjectionState = { openTurn: null, last: null }

describe('turn-notify projection', () => {
  it('keeps an empty view before the first ended turn', () => {
    const definition = turnNotifyProjection()
    expect(definition.key).toBe(PROJECTION_KEY)
    expect(definition.wire.view(initial)).toBe(EMPTY_PROJECTION)
  })

  it('folds turn/start + turn/end into the last value', () => {
    const started = applyProjectionEvent(initial, { type: 'turn/start', data: { turn: 2 } })
    expect(started).toEqual({ openTurn: 2, last: null })
    expect(turnNotifyProjection().wire.view(started)).toBe(EMPTY_PROJECTION)

    const ended = applyProjectionEvent(started, {
      type: 'turn/end',
      data: { turn: 2, reason: { kind: 'completed' } },
    })
    expect(ended).toEqual({ openTurn: null, last: { turn: 2, reason: 'completed' } })
    expect(turnNotifyProjection().wire.view(ended)).toEqual({ turn: 2, reason: 'completed' })
  })

  it('preserves the error reason for the failure copy', () => {
    const started = applyProjectionEvent(initial, { type: 'turn/start', data: { turn: 7 } })
    const ended = applyProjectionEvent(started, {
      type: 'turn/end',
      data: { turn: 7, reason: { kind: 'error' } },
    })
    expect(ended.last).toEqual({ turn: 7, reason: 'error' })
  })

  it('ignores an end without a matching start', () => {
    expect(applyProjectionEvent(initial, {
      type: 'turn/end',
      data: { turn: 3, reason: { kind: 'completed' } },
    })).toBe(initial)
  })

  it('returns the same reference for unrelated events', () => {
    const started = applyProjectionEvent(initial, { type: 'turn/start', data: { turn: 1 } })
    expect(applyProjectionEvent(started, { type: 'assistant/message', data: { turn: 1 } })).toBe(started)
    expect(applyProjectionEvent(started, { type: 'tool/call', data: { turn: 1 } })).toBe(started)
    expect(applyProjectionEvent(started, { type: 'turn/start' })).toBe(started)
  })

  it('validates its state and wire schemas', () => {
    const definition = turnNotifyProjection()
    expect(definition.stateSchema.parse(initial)).toEqual(initial)
    expect(definition.wire.viewSchema.parse({ turn: 0, reason: '' })).toEqual({ turn: 0, reason: '' })
    expect(() => definition.wire.viewSchema.parse({ turn: -1, reason: 'x' })).toThrow()
    expect(() => definition.stateSchema.parse({ openTurn: null })).toThrow()
  })

  it('handles a missing reason kind as silent vocabulary', () => {
    const started = applyProjectionEvent(initial, { type: 'turn/start', data: { turn: 4 } })
    const ended = applyProjectionEvent(started, { type: 'turn/end', data: { turn: 4 } })
    expect(ended.last).toEqual({ turn: 4, reason: '' })
  })
})
