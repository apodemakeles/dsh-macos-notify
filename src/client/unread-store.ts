/**
 * In-memory unread-completion store for the enhanced session-row dot. A mark
 * exists while a turn finished during window-unfocused time and the user has
 * not gone back to that session. It is intentionally not persisted: a plugin
 * reload starts from the official UI's own completion state.
 */
import type { TurnNotifyOutcome } from '../shared'

export type UnreadKind = TurnNotifyOutcome

export interface UnreadStore {
  getSnapshot(): ReadonlyMap<string, UnreadKind>
  subscribe(listener: () => void): () => void
  set(sessionId: string, kind: UnreadKind): void
  delete(sessionId: string): void
  clear(): void
}

export function createUnreadStore(): UnreadStore {
  let value: ReadonlyMap<string, UnreadKind> = new Map()
  const listeners = new Set<() => void>()

  const emit = (next: Map<string, UnreadKind>): void => {
    value = next
    for (const listener of [...listeners]) listener()
  }

  return {
    getSnapshot: () => value,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    set: (sessionId, kind) => {
      if (value.get(sessionId) === kind) return
      const next = new Map(value)
      next.set(sessionId, kind)
      emit(next)
    },
    delete: (sessionId) => {
      if (!value.has(sessionId)) return
      const next = new Map(value)
      next.delete(sessionId)
      emit(next)
    },
    clear: () => {
      if (value.size === 0) return
      emit(new Map())
    },
  }
}
