/** `dsh-macos-notify` locale namespace (zh primary, en secondary). */

export const LOCALE_NS = 'dsh-macos-notify'

export const zh = {
  nav: '通知',
  title: '轮次完成通知',
  description: '对话处理完成后，若 DeepSeek Harness 不在前台，弹 macOS 系统通知。',
  enabled: '启用通知',
  enabledDesc: '关闭后不再弹通知，偏好设置仍会保留。',
  permission: '通知权限',
  permissionGranted: '已授权',
  permissionDenied: '已拒绝（请在系统设置 → 通知 中允许 DeepSeek Harness）',
  permissionDefault: '未授权',
  permissionUnsupported: '当前环境不支持系统通知',
  request: '请求通知权限',
  test: '发送测试通知',
  testTitle: 'DeepSeek Harness',
  testBody: '测试通知：配置成功。',
  testSent: '测试通知已发送。若没看到，请检查系统通知设置和专注模式。',
  testFailed: '无法发送测试通知：{message}',
  bodyOk: '处理完成',
  bodyFail: '处理失败',
  unreadOk: '已完成，未读',
  unreadFail: '处理失败，未读',
} as const

export const en = {
  nav: 'Notifications',
  title: 'Turn completion notifications',
  description: 'Show a macOS notification when a turn finishes while DeepSeek Harness is not in the foreground.',
  enabled: 'Enable notifications',
  enabledDesc: 'Turning this off stops notifications and keeps your preference.',
  permission: 'Notification permission',
  permissionGranted: 'Granted',
  permissionDenied: 'Denied (allow DeepSeek Harness in System Settings → Notifications)',
  permissionDefault: 'Not granted',
  permissionUnsupported: 'System notifications are unavailable in this environment',
  request: 'Request permission',
  test: 'Send a test notification',
  testTitle: 'DeepSeek Harness',
  testBody: 'Test notification: configuration works.',
  testSent: 'Test notification sent. If you did not see it, check system notifications and Focus.',
  testFailed: 'Could not send a test notification: {message}',
  bodyOk: 'Completed',
  bodyFail: 'Failed',
  unreadOk: 'Completed — unread',
  unreadFail: 'Failed — unread',
} as const

export type LocaleKey = keyof typeof zh
