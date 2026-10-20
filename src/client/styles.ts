/** Small scoped stylesheet for the settings section. */

export const STYLE_ID = 'dsh-macos-notify-styles'

const STYLE_TEXT = [
  '.dsh-macos-notify-section { display: flex; flex-direction: column; gap: 14px; }',
  '.dsh-macos-notify-section h2 { margin: 0; font-size: 16px; font-weight: 600; }',
  '.dsh-macos-notify-section p { margin: 0; font-size: 12px; line-height: 1.5; color: var(--dsh-text-secondary, #6b7280); }',
  '.dsh-macos-notify-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }',
  '.dsh-macos-notify-row label { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; }',
  '.dsh-macos-notify-row button { font-size: 12px; padding: 4px 10px; border-radius: 6px; border: 1px solid var(--dsh-border, rgba(0,0,0,.15)); background: transparent; cursor: pointer; }',
  '.dsh-macos-notify-hint { font-size: 12px; color: var(--dsh-text-secondary, #6b7280); }',
  '.dsh-macos-notify-error { font-size: 12px; color: #d93025; }',
  '.dsh-macos-notify-unread-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #34c759; box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08); }',
  '.dsh-macos-notify-unread-dot[data-kind="fail"] { background: #ff3b30; }',
].join('\n')

/** Mount the stylesheet; returns its disposer. */
export function injectStyles(): () => void {
  if (typeof document === 'undefined') return () => undefined
  if (document.getElementById(STYLE_ID) !== null) return () => undefined
  const element = document.createElement('style')
  element.id = STYLE_ID
  element.textContent = STYLE_TEXT
  document.head.appendChild(element)
  return () => {
    document.getElementById(STYLE_ID)?.remove()
  }
}
