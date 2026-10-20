/**
 * Browser half: watch the session list for a fresh `turn-notify` projection
 * value, apply the original relevance rules (master switch, subagent filter,
 * turn-end reason, focus gate), show a native notification, and open the
 * session on click. The host half only folds the projection.
 */
import {
  PROJECTION_KEY,
  decideTurnEnd,
  projectionAdvance,
  sessionTitle,
  shouldMarkUnread,
  shouldNotify,
  type TurnNotifyProjectionValue,
  type TurnNotifySettings,
} from '../shared'
import { LOCALE_NS, en, zh } from './locales'
import { SettingsSection, type SettingsSectionInjected } from './SettingsSection'
import { createSettingsStore } from './store'
import { injectStyles } from './styles'
import { createUnreadDotEntry } from './UnreadDot'
import { createUnreadStore } from './unread-store'

/** Required client services. */
export const inject = ['sessions', 'slots', 'locale', 'uiWorkspace']

interface SessionSummary {
  id: string
  title?: string
  displayTitle?: string
  origin?: string
  running?: boolean
  retainedBy?: { mainView?: number }
  projectionValues?: Record<string, TurnNotifyProjectionValue | undefined>
}

interface SessionListState {
  ids: readonly string[]
  byId: Readonly<Record<string, SessionSummary>>
}

interface SessionsFace {
  list: {
    getSnapshot(): SessionListState
    subscribe(listener: () => void): () => void
  }
}

interface SlotsFace {
  inject(name: string, factory: () => unknown): unknown
  register(entry: object, component: unknown): unknown
}

interface LocaleFace {
  register(namespace: string, dictionaries: Record<string, Record<string, string>>): unknown
  bind(namespace: string): (key: string, vars?: Record<string, string>) => string
}

interface WorkspaceFace {
  openSession(sessionId: string): unknown
}

interface ClientContext {
  effect(task: () => unknown, name?: string): void
  on(event: string, listener: () => void): () => void
  get(name: string): unknown
  slots: SlotsFace
  locale: LocaleFace
}

function notificationApi(): typeof Notification | undefined {
  return typeof Notification === 'undefined' ? undefined : Notification
}

function pageHasFocus(): boolean {
  return typeof document === 'undefined' ? false : document.hasFocus()
}

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(LOCALE_NS, { zh, en }), 'dsh-macos-notify: dictionaries')
  ctx.effect(() => injectStyles(), 'dsh-macos-notify: styles')

  const t = ctx.locale.bind(LOCALE_NS)
  const sessions = ctx.get('sessions') as SessionsFace | undefined
  const workspace = ctx.get('uiWorkspace') as WorkspaceFace | undefined
  const settings = createSettingsStore()
  const unread = createUnreadStore()

  if (sessions === undefined) {
    console.warn('dsh-macos-notify: sessions service unavailable; notifications disabled')
    return
  }

  const show = (title: string, body: string, tag: string, sessionId: string): void => {
    const api = notificationApi()
    if (api === undefined || api.permission !== 'granted') return
    try {
      const notification = new api(title, { body, tag })
      notification.onclick = () => {
        unread.delete(sessionId)
        try {
          window.focus()
        } catch {
          // Focusing can be denied by the shell; opening the session still counts.
        }
        try {
          workspace?.openSession(sessionId)
        } catch (error) {
          console.error('dsh-macos-notify: opening the session failed', error)
        }
        try {
          notification.close()
        } catch {
          // Already closed by the OS.
        }
      }
    } catch (error) {
      console.error('dsh-macos-notify: creating the notification failed', error)
    }
  }

  /** Last projection turn observed per session; seeds history silently. */
  const observedTurn = new Map<string, number>()
  /** Main-view membership from the previous snapshot, for read transitions. */
  let previousMain = new Set<string>()

  const observe = (): void => {
    const state = sessions.list.getSnapshot()
    const current = settings.getSnapshot()
    const focused = pageHasFocus()
    const mainNow = new Set<string>()
    for (const id of state.ids) {
      const summary = state.byId[id]
      if (summary === undefined) continue
      if (summary.running === true) unread.delete(id)
      if ((summary.retainedBy?.mainView ?? 0) > 0) mainNow.add(id)
      const projection = summary.projectionValues?.[PROJECTION_KEY]
      const { nextTurn, fresh } = projectionAdvance(observedTurn.get(id), projection)
      if (nextTurn !== undefined) observedTurn.set(id, nextTurn)
      if (!fresh || nextTurn === undefined || projection === undefined) continue

      const outcome = decideTurnEnd(projection.reason)
      if (outcome === 'silent') continue
      if (shouldMarkUnread({
        enabled: current.enabled,
        origin: summary.origin,
        reason: projection.reason,
        focused,
      })) {
        unread.set(id, outcome)
      }
      if (!shouldNotify({
        enabled: current.enabled,
        origin: summary.origin,
        reason: projection.reason,
        focused,
        permission: notificationApi()?.permission ?? 'unsupported',
      })) continue

      show(
        sessionTitle(summary),
        t(outcome === 'ok' ? 'bodyOk' : 'bodyFail'),
        `dsh-macos-notify-${id}-${nextTurn}`,
        id,
      )
    }
    // Re-entering the main view is an explicit read. A session that was
    // already main at completion keeps its dot until the row is clicked.
    for (const id of mainNow) {
      if (!previousMain.has(id) && unread.getSnapshot().has(id)) unread.delete(id)
    }
    previousMain = mainNow
    const live = new Set(state.ids)
    for (const id of [...observedTurn.keys()]) {
      if (!live.has(id)) {
        observedTurn.delete(id)
        unread.delete(id)
      }
    }
  }

  ctx.effect(() => {
    const stopList = sessions.list.subscribe(observe)
    const stopReset = ctx.on('connection/reset', () => {
      observedTurn.clear()
      observe()
    })
    // Seed the baseline after subscribing: the first projection value of a
    // session never notifies, so history and reconnect gaps stay silent.
    observe()
    return () => {
      stopList()
      stopReset()
    }
  }, 'dsh-macos-notify: turn completion watch')

  ctx.effect(() => {
    const onClick = (event: MouseEvent): void => {
      const target = event.target as Element | null
      if (target === null) return
      if (target.closest('button, [role="menu"], [role="menuitem"]') !== null) return
      const row = target.closest('[data-row-key^="session:"]')
      if (!(row instanceof HTMLElement)) return
      const key = row.dataset.rowKey
      if (key === undefined) return
      unread.delete(key.slice('session:'.length))
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
    }
  }, 'dsh-macos-notify: unread clear on session row click')

  const injected = (): SettingsSectionInjected => ({
    hooks: { settings },
    set: (patch) => {
      settings.update((draft) => {
        if (typeof patch.enabled === 'boolean') draft.enabled = patch.enabled
      })
    },
    requestPermission: async () => {
      const api = notificationApi()
      if (api === undefined) return 'denied'
      if (api.permission === 'granted') return api.permission
      try {
        return await api.requestPermission()
      } catch {
        return 'denied'
      }
    },
    sendTest: () => {
      const api = notificationApi()
      if (api === undefined) return { ok: false, message: t('permissionUnsupported') }
      if (api.permission !== 'granted') return { ok: false, message: t('permissionDefault') }
      try {
        const notification = new api(t('testTitle'), {
          body: t('testBody'),
          tag: `dsh-macos-notify-test-${Date.now()}`,
        })
        notification.onclick = () => {
          try {
            notification.close()
          } catch {
            // Already closed.
          }
        }
        return { ok: true }
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : String(error) }
      }
    },
  })

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'dsh-macos-notify',
    order: 40,
    label: () => t('nav'),
    locale: LOCALE_NS,
    inject: injected,
  }, SettingsSection))

  // The official row renders this seat only while its own status dot is idle;
  // a background completion keeps the official dot and our slot stays hidden.
  ctx.slots.inject('sidebar.session.row.leading', function* () {
    yield ctx.slots.register({
      name: 'sidebar.session.row.leading',
      id: 'dsh-macos-notify-unread',
      order: 10,
    }, createUnreadDotEntry(unread, t))
  })
}
