/**
 * Settings section: one master switch, the permission state, and a test
 * notification. Preferences live in the client store; the host knows nothing
 * about them.
 */
import { useEffect, useState } from 'react'
import type { TurnNotifySettings } from '../shared'
import type { SnapshotStore } from './store'

export interface SettingsSectionInjected {
  hooks: { settings: SnapshotStore<TurnNotifySettings> }
  set: (patch: Partial<TurnNotifySettings>) => void
  requestPermission: () => Promise<NotificationPermission>
  sendTest: () => { ok: boolean; message?: string }
}

export interface SettingsSectionProps extends SettingsSectionInjected {
  useSettings: <T>(selector: (snapshot: TurnNotifySettings) => T) => T
  t: (key: string, vars?: Record<string, string>) => string
}

type PermissionState = NotificationPermission | 'unsupported'

function currentPermission(): PermissionState {
  return typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
}

function permissionKey(permission: PermissionState): string {
  switch (permission) {
    case 'granted': return 'permissionGranted'
    case 'denied': return 'permissionDenied'
    case 'unsupported': return 'permissionUnsupported'
    default: return 'permissionDefault'
  }
}

export function SettingsSection(props: SettingsSectionProps): JSX.Element {
  const { useSettings, set, requestPermission, sendTest, t } = props
  const settings = useSettings(snapshot => snapshot)
  const [permission, setPermission] = useState<PermissionState>(currentPermission)
  const [hint, setHint] = useState<{ text: string; error: boolean } | null>(null)

  useEffect(() => {
    const refresh = (): void => setPermission(currentPermission())
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  const request = async (): Promise<void> => {
    const next = await requestPermission()
    setPermission(next)
    setHint(null)
  }

  const test = async (): Promise<void> => {
    let current = currentPermission()
    if (current !== 'granted' && current !== 'unsupported') {
      current = await requestPermission()
      setPermission(current)
    }
    if (current !== 'granted') {
      setHint({ text: t(permissionKey(current)), error: true })
      return
    }
    const result = sendTest()
    setHint(result.ok
      ? { text: t('testSent'), error: false }
      : { text: t('testFailed', { message: result.message ?? '' }), error: true })
  }

  return (
    <section className="dsh-macos-notify-section">
      <div>
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      <div className="dsh-macos-notify-row">
        <label>
          <input
            type="checkbox"
            checked={settings?.enabled ?? true}
            onChange={(event) => set({ enabled: event.target.checked })}
          />
          <span>{t('enabled')}</span>
        </label>
      </div>
      <p>{t('enabledDesc')}</p>

      <div className="dsh-macos-notify-row">
        <span className="dsh-macos-notify-hint">{t('permission')}: {t(permissionKey(permission))}</span>
        <button type="button" onClick={() => { void request() }}>{t('request')}</button>
        <button type="button" onClick={() => { void test() }}>{t('test')}</button>
      </div>
      {hint === null ? null : (
        <span className={hint.error ? 'dsh-macos-notify-error' : 'dsh-macos-notify-hint'} aria-live="polite">
          {hint.text}
        </span>
      )}
    </section>
  )
}
