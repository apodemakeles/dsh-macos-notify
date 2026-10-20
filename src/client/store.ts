/**
 * Client-owned settings: one tiny snapshot store persisted in localStorage.
 * The host projection carries no preferences; the browser is the single
 * source of truth for the switch.
 */
import { SETTINGS_KEY, type TurnNotifySettings } from '../shared'

export interface SnapshotStore<T> {
  getSnapshot(): T
  subscribe(listener: () => void): () => void
  update(mutator: (draft: T) => void): void
}

export function defaultSettings(): TurnNotifySettings {
  return { enabled: true }
}

type ReadStorage = Pick<Storage, 'getItem'>
type WriteStorage = Pick<Storage, 'setItem'>

function defaultReadStorage(): ReadStorage | undefined {
  return typeof localStorage === 'undefined' ? undefined : localStorage
}

function defaultWriteStorage(): WriteStorage | undefined {
  return typeof localStorage === 'undefined' ? undefined : localStorage
}

export function loadSettings(storage: ReadStorage | undefined = defaultReadStorage()): TurnNotifySettings {
  if (storage === undefined) return defaultSettings()
  try {
    const raw = storage.getItem(SETTINGS_KEY)
    if (raw === null) return defaultSettings()
    const parsed = JSON.parse(raw) as Partial<TurnNotifySettings>
    return { enabled: parsed.enabled !== false }
  } catch {
    return defaultSettings()
  }
}

export function saveSettings(
  settings: TurnNotifySettings,
  storage: WriteStorage | undefined = defaultWriteStorage(),
): void {
  if (storage === undefined) return
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // Quota or privacy mode: the in-memory switch still works for this page.
  }
}

export function createSettingsStore(): SnapshotStore<TurnNotifySettings> {
  let value = loadSettings()
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => value,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    update: (mutator) => {
      const next = { ...value }
      mutator(next)
      value = next
      saveSettings(next)
      for (const listener of [...listeners]) listener()
    },
  }
}
