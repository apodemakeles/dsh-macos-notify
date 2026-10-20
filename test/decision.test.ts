import { describe, expect, it } from 'vitest'
import {
  decideTurnEnd,
  projectionAdvance,
  sessionTitle,
  shouldMarkUnread,
  shouldNotify,
} from '../src/shared'

describe('turn-end mapping', () => {
  it('maps the original outcome vocabulary', () => {
    expect(decideTurnEnd('completed')).toBe('ok')
    expect(decideTurnEnd('max-tokens')).toBe('ok')
    expect(decideTurnEnd('blocked')).toBe('ok')
    expect(decideTurnEnd('error')).toBe('fail')
    expect(decideTurnEnd('aborted')).toBe('silent')
    expect(decideTurnEnd('interrupted')).toBe('silent')
    expect(decideTurnEnd(undefined)).toBe('silent')
    expect(decideTurnEnd('some-future-kind')).toBe('silent')
  })
})

describe('projection advance', () => {
  it('seeds the first observation without firing', () => {
    expect(projectionAdvance(undefined, { turn: 3, reason: 'completed' })).toEqual({ nextTurn: 3, fresh: false })
    expect(projectionAdvance(undefined, undefined)).toEqual({ nextTurn: undefined, fresh: false })
  })

  it('fires only when the turn number advances', () => {
    expect(projectionAdvance(2, { turn: 3, reason: 'completed' })).toEqual({ nextTurn: 3, fresh: true })
    expect(projectionAdvance(3, { turn: 3, reason: 'completed' })).toEqual({ nextTurn: 3, fresh: false })
    expect(projectionAdvance(3, { turn: 2, reason: 'aborted' })).toEqual({ nextTurn: 2, fresh: false })
  })

  it('stores turn 0 as the baseline so a new session’s first completion fires', () => {
    const seeded = projectionAdvance(undefined, { turn: 0, reason: '' })
    expect(seeded).toEqual({ nextTurn: 0, fresh: false })
    expect(projectionAdvance(seeded.nextTurn, { turn: 1, reason: 'completed' })).toEqual({ nextTurn: 1, fresh: true })
  })

  it('treats a regressed projection as a silent reseed', () => {
    expect(projectionAdvance(4, { turn: 0, reason: '' })).toEqual({ nextTurn: 0, fresh: false })
  })
})

describe('session title', () => {
  it('prefers the display title, then the durable title, then the id', () => {
    expect(sessionTitle({ id: 's1', displayTitle: '修复登录', title: 'durable' })).toBe('修复登录')
    expect(sessionTitle({ id: 's1', title: 'durable' })).toBe('durable')
    expect(sessionTitle({ id: 's1' })).toBe('s1')
    expect(sessionTitle({ id: 's1', displayTitle: '  ' })).toBe('s1')
  })
})

describe('notification gate', () => {
  const base = {
    enabled: true,
    origin: undefined as string | undefined,
    reason: 'completed' as string | undefined,
    focused: false,
    permission: 'granted' as NotificationPermission | 'unsupported',
  }

  it('passes only when every original rule passes', () => {
    expect(shouldNotify(base)).toBe(true)
  })

  it('respects the switch, subagent filter, reason vocabulary, focus, and permission', () => {
    expect(shouldNotify({ ...base, enabled: false })).toBe(false)
    expect(shouldNotify({ ...base, origin: 'subagent' })).toBe(false)
    expect(shouldNotify({ ...base, reason: 'aborted' })).toBe(false)
    expect(shouldNotify({ ...base, reason: 'error' })).toBe(true)
    expect(shouldNotify({ ...base, focused: true })).toBe(false)
    expect(shouldNotify({ ...base, permission: 'default' })).toBe(false)
    expect(shouldNotify({ ...base, permission: 'unsupported' })).toBe(false)
  })
})

describe('unread dot gate', () => {
  const base = {
    enabled: true,
    origin: undefined as string | undefined,
    reason: 'completed' as string | undefined,
    focused: false,
  }

  it('marks an unfocused eligible completion, including a session already in the main view', () => {
    expect(shouldMarkUnread(base)).toBe(true)
    expect(shouldMarkUnread({ ...base, reason: 'error' })).toBe(true)
  })

  it('respects the switch, subagent filter, reason vocabulary, and focus', () => {
    expect(shouldMarkUnread({ ...base, enabled: false })).toBe(false)
    expect(shouldMarkUnread({ ...base, origin: 'subagent' })).toBe(false)
    expect(shouldMarkUnread({ ...base, reason: 'aborted' })).toBe(false)
    expect(shouldMarkUnread({ ...base, reason: 'interrupted' })).toBe(false)
    expect(shouldMarkUnread({ ...base, focused: true })).toBe(false)
  })
})
