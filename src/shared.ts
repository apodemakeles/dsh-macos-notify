/**
 * Shared, browser-safe contract between the host projection and the client
 * notification runner. No Node or DOM types here.
 */

/** Projection key registered by the host and read off each session summary. */
export const PROJECTION_KEY = 'turn-notify'

/** localStorage key for the client-owned settings. */
export const SETTINGS_KEY = 'dsh-macos-notify.v1'

/** What the host projection exposes to the browser. */
export interface TurnNotifyProjectionValue {
  /** The turn that last ended; 0 before the first completed turn. */
  turn: number
  /** Raw `turn/end` reason kind (completed / error / aborted / ...). */
  reason: string
}

/** Client-owned preferences. */
export interface TurnNotifySettings {
  /** Master switch; false stops every notification. */
  enabled: boolean
}

export type TurnNotifyOutcome = 'ok' | 'fail'
export type TurnNotifyDecision = TurnNotifyOutcome | 'silent'

/**
 * The original spec: completed/max-tokens/blocked → 处理完成, error → 处理失败,
 * everything else (aborted/interrupted/unknown) stays silent.
 */
export function decideTurnEnd(reason: string | undefined): TurnNotifyDecision {
  switch (reason) {
    case 'completed':
    case 'max-tokens':
    case 'blocked':
      return 'ok'
    case 'error':
      return 'fail'
    default:
      return 'silent'
  }
}

export interface ProjectionAdvance {
  nextTurn: number | undefined
  fresh: boolean
}

/**
 * Fold one session's projection observation. The first value (or a missing
 * value) only seeds the baseline, so history and a completion that landed
 * while disconnected never fire. A later larger turn is a fresh completion.
 */
export function projectionAdvance(
  prevTurn: number | undefined,
  projection: TurnNotifyProjectionValue | undefined,
): ProjectionAdvance {
  if (projection === undefined || !Number.isSafeInteger(projection.turn) || projection.turn < 0) {
    return { nextTurn: prevTurn, fresh: false }
  }
  // Turn 0 is a real baseline: a new session's first completion is turn 1 and
  // must fire, so storing the initial zero is what makes that difference.
  if (prevTurn === undefined) return { nextTurn: projection.turn, fresh: false }
  return { nextTurn: projection.turn, fresh: projection.turn > prevTurn }
}

/** Session display name: durable title, projected title, then the id. */
export function sessionTitle(summary: { id: string; title?: string; displayTitle?: string }): string {
  const display = summary.displayTitle?.trim()
  if (display !== undefined && display !== '') return display
  const title = summary.title?.trim()
  if (title !== undefined && title !== '') return title
  return summary.id
}

export interface NotifyGate {
  enabled: boolean
  origin: string | undefined
  reason: string | undefined
  /** `document.hasFocus()` at event time. */
  focused: boolean
  permission: NotificationPermission | 'unsupported'
}

/** Unread-dot gate: the same relevance rules, without the OS-permission gate. */
export interface UnreadGate {
  enabled: boolean
  origin: string | undefined
  reason: string | undefined
  /** `document.hasFocus()` at event time. */
  focused: boolean
}

function isRelevant(gate: { enabled: boolean; origin: string | undefined; reason: string | undefined }): boolean {
  if (!gate.enabled) return false
  if (gate.origin === 'subagent') return false
  return decideTurnEnd(gate.reason) !== 'silent'
}

/** Every relevance filter in one pure predicate. */
export function shouldNotify(gate: NotifyGate): boolean {
  return isRelevant(gate) && !gate.focused && gate.permission === 'granted'
}

/**
 * The enhanced unread dot: a completion that happened while the window was
 * unfocused, even when the session stayed in the main view. The official
 * `completionUnread` dot only covers background sessions; this fills the
 * main-view gap (and doubles as a fallback when the official edge was missed).
 */
export function shouldMarkUnread(gate: UnreadGate): boolean {
  return isRelevant(gate) && !gate.focused
}
