import { describe, expect, it } from 'vitest'
import { createUnreadStore } from '../src/client/unread-store'

describe('unread store', () => {
  it('publishes new snapshots for set, replace, delete, and clear', () => {
    const store = createUnreadStore()
    const initial = store.getSnapshot()
    let calls = 0
    const stop = store.subscribe(() => { calls += 1 })

    store.set('a', 'ok')
    expect(store.getSnapshot().get('a')).toBe('ok')
    expect(store.getSnapshot()).not.toBe(initial)

    store.set('a', 'ok')
    expect(calls).toBe(1)

    store.set('a', 'fail')
    expect(calls).toBe(2)
    expect(store.getSnapshot().get('a')).toBe('fail')

    store.delete('a')
    expect(store.getSnapshot().has('a')).toBe(false)
    expect(calls).toBe(3)

    store.set('b', 'ok')
    store.clear()
    expect(store.getSnapshot().size).toBe(0)
    expect(calls).toBe(5)

    stop()
    store.set('c', 'ok')
    expect(calls).toBe(5)
  })
})
