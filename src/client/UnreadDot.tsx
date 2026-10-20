/**
 * Leading-slot decoration for a session row: a small green dot for an
 * unfocused completion the user has not reopened. The official UI renders the
 * `sidebar.session.row.leading` seat only while the row's primary status is
 * idle, so this dot never stacks on top of the official completed dot.
 */
import { useSyncExternalStore } from 'react'
import type { UnreadStore } from './unread-store'

export interface UnreadDotProps {
  sessionId: string
}

export function createUnreadDotEntry(
  store: UnreadStore,
  t: (key: string, vars?: Record<string, string>) => string,
) {
  return function UnreadDot({ sessionId }: UnreadDotProps): JSX.Element | null {
    const unread = useSyncExternalStore(store.subscribe, store.getSnapshot)
    const kind = unread.get(sessionId)
    if (kind === undefined) return null
    const label = t(kind === 'ok' ? 'unreadOk' : 'unreadFail')
    return (
      <span
        className="dsh-macos-notify-unread-dot"
        data-kind={kind}
        role="img"
        aria-label={label}
        title={label}
      />
    )
  }
}
