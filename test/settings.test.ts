import { afterEach, describe, expect, it } from 'vitest'
import { SETTINGS_KEY } from '../src/shared'
import {
  createSettingsStore,
  defaultSettings,
  loadSettings,
  saveSettings,
} from '../src/client/store'

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => { map.set(key, value) },
    dump: () => Object.fromEntries(map),
  }
}

afterEach(() => {
  delete (globalThis as { localStorage?: unknown }).localStorage
})

describe('settings persistence', () => {
  it('defaults to enabled', () => {
    expect(defaultSettings()).toEqual({ enabled: true })
    expect(loadSettings(fakeStorage())).toEqual({ enabled: true })
  })

  it('reads the saved switch and falls back on broken data', () => {
    expect(loadSettings(fakeStorage({ [SETTINGS_KEY]: '{"enabled":false}' }))).toEqual({ enabled: false })
    expect(loadSettings(fakeStorage({ [SETTINGS_KEY]: '{"enabled":true}' }))).toEqual({ enabled: true })
    expect(loadSettings(fakeStorage({ [SETTINGS_KEY]: 'not json' }))).toEqual({ enabled: true })
  })

  it('writes through saveSettings', () => {
    const storage = fakeStorage()
    saveSettings({ enabled: false }, storage)
    expect(storage.dump()[SETTINGS_KEY]).toBe('{"enabled":false}')
  })

  it('updates the store, notifies subscribers once, and persists', () => {
    const storage = fakeStorage()
    ;(globalThis as { localStorage?: unknown }).localStorage = storage
    const store = createSettingsStore()
    let calls = 0
    const stop = store.subscribe(() => { calls += 1 })
    expect(store.getSnapshot()).toEqual({ enabled: true })
    store.update((draft) => { draft.enabled = false })
    expect(calls).toBe(1)
    expect(store.getSnapshot()).toEqual({ enabled: false })
    expect(storage.dump()[SETTINGS_KEY]).toBe('{"enabled":false}')
    stop()
    store.update((draft) => { draft.enabled = true })
    expect(calls).toBe(1)
  })
})
