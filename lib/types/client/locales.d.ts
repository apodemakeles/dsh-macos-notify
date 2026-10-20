/** `dsh-macos-notify` locale namespace (zh primary, en secondary). */
export declare const LOCALE_NS = "dsh-macos-notify";
export declare const zh: {
    readonly nav: "通知";
    readonly title: "轮次完成通知";
    readonly description: "对话处理完成后，若 DeepSeek Harness 不在前台，弹 macOS 系统通知。";
    readonly enabled: "启用通知";
    readonly enabledDesc: "关闭后不再弹通知，偏好设置仍会保留。";
    readonly permission: "通知权限";
    readonly permissionGranted: "已授权";
    readonly permissionDenied: "已拒绝（请在系统设置 → 通知 中允许 DeepSeek Harness）";
    readonly permissionDefault: "未授权";
    readonly permissionUnsupported: "当前环境不支持系统通知";
    readonly request: "请求通知权限";
    readonly test: "发送测试通知";
    readonly testTitle: "DeepSeek Harness";
    readonly testBody: "测试通知：配置成功。";
    readonly testSent: "测试通知已发送。若没看到，请检查系统通知设置和专注模式。";
    readonly testFailed: "无法发送测试通知：{message}";
    readonly bodyOk: "处理完成";
    readonly bodyFail: "处理失败";
    readonly unreadOk: "已完成，未读";
    readonly unreadFail: "处理失败，未读";
};
export declare const en: {
    readonly nav: "Notifications";
    readonly title: "Turn completion notifications";
    readonly description: "Show a macOS notification when a turn finishes while DeepSeek Harness is not in the foreground.";
    readonly enabled: "Enable notifications";
    readonly enabledDesc: "Turning this off stops notifications and keeps your preference.";
    readonly permission: "Notification permission";
    readonly permissionGranted: "Granted";
    readonly permissionDenied: "Denied (allow DeepSeek Harness in System Settings → Notifications)";
    readonly permissionDefault: "Not granted";
    readonly permissionUnsupported: "System notifications are unavailable in this environment";
    readonly request: "Request permission";
    readonly test: "Send a test notification";
    readonly testTitle: "DeepSeek Harness";
    readonly testBody: "Test notification: configuration works.";
    readonly testSent: "Test notification sent. If you did not see it, check system notifications and Focus.";
    readonly testFailed: "Could not send a test notification: {message}";
    readonly bodyOk: "Completed";
    readonly bodyFail: "Failed";
    readonly unreadOk: "Completed — unread";
    readonly unreadFail: "Failed — unread";
};
export type LocaleKey = keyof typeof zh;
//# sourceMappingURL=locales.d.ts.map