window.__ModuleLoader__.load({ id: '@apodemakeles/dsh-macos-notify', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/shared.ts
var PROJECTION_KEY = "turn-notify";
var SETTINGS_KEY = "dsh-macos-notify.v1";
function decideTurnEnd(reason) {
  switch (reason) {
    case "completed":
    case "max-tokens":
    case "blocked":
      return "ok";
    case "error":
      return "fail";
    default:
      return "silent";
  }
}
function projectionAdvance(prevTurn, projection) {
  if (projection === void 0 || !Number.isSafeInteger(projection.turn) || projection.turn < 0) {
    return { nextTurn: prevTurn, fresh: false };
  }
  if (prevTurn === void 0) return { nextTurn: projection.turn, fresh: false };
  return { nextTurn: projection.turn, fresh: projection.turn > prevTurn };
}
function sessionTitle(summary) {
  const display = summary.displayTitle?.trim();
  if (display !== void 0 && display !== "") return display;
  const title = summary.title?.trim();
  if (title !== void 0 && title !== "") return title;
  return summary.id;
}
function isRelevant(gate) {
  if (!gate.enabled) return false;
  if (gate.origin === "subagent") return false;
  return decideTurnEnd(gate.reason) !== "silent";
}
function shouldNotify(gate) {
  return isRelevant(gate) && !gate.focused && gate.permission === "granted";
}
function shouldMarkUnread(gate) {
  return isRelevant(gate) && !gate.focused;
}

// src/client/locales.ts
var LOCALE_NS = "dsh-macos-notify";
var zh = {
  nav: "\u901A\u77E5",
  title: "\u8F6E\u6B21\u5B8C\u6210\u901A\u77E5",
  description: "\u5BF9\u8BDD\u5904\u7406\u5B8C\u6210\u540E\uFF0C\u82E5 DeepSeek Harness \u4E0D\u5728\u524D\u53F0\uFF0C\u5F39 macOS \u7CFB\u7EDF\u901A\u77E5\u3002",
  enabled: "\u542F\u7528\u901A\u77E5",
  enabledDesc: "\u5173\u95ED\u540E\u4E0D\u518D\u5F39\u901A\u77E5\uFF0C\u504F\u597D\u8BBE\u7F6E\u4ECD\u4F1A\u4FDD\u7559\u3002",
  permission: "\u901A\u77E5\u6743\u9650",
  permissionGranted: "\u5DF2\u6388\u6743",
  permissionDenied: "\u5DF2\u62D2\u7EDD\uFF08\u8BF7\u5728\u7CFB\u7EDF\u8BBE\u7F6E \u2192 \u901A\u77E5 \u4E2D\u5141\u8BB8 DeepSeek Harness\uFF09",
  permissionDefault: "\u672A\u6388\u6743",
  permissionUnsupported: "\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u7CFB\u7EDF\u901A\u77E5",
  request: "\u8BF7\u6C42\u901A\u77E5\u6743\u9650",
  test: "\u53D1\u9001\u6D4B\u8BD5\u901A\u77E5",
  testTitle: "DeepSeek Harness",
  testBody: "\u6D4B\u8BD5\u901A\u77E5\uFF1A\u914D\u7F6E\u6210\u529F\u3002",
  testSent: "\u6D4B\u8BD5\u901A\u77E5\u5DF2\u53D1\u9001\u3002\u82E5\u6CA1\u770B\u5230\uFF0C\u8BF7\u68C0\u67E5\u7CFB\u7EDF\u901A\u77E5\u8BBE\u7F6E\u548C\u4E13\u6CE8\u6A21\u5F0F\u3002",
  testFailed: "\u65E0\u6CD5\u53D1\u9001\u6D4B\u8BD5\u901A\u77E5\uFF1A{message}",
  bodyOk: "\u5904\u7406\u5B8C\u6210",
  bodyFail: "\u5904\u7406\u5931\u8D25",
  unreadOk: "\u5DF2\u5B8C\u6210\uFF0C\u672A\u8BFB",
  unreadFail: "\u5904\u7406\u5931\u8D25\uFF0C\u672A\u8BFB"
};
var en = {
  nav: "Notifications",
  title: "Turn completion notifications",
  description: "Show a macOS notification when a turn finishes while DeepSeek Harness is not in the foreground.",
  enabled: "Enable notifications",
  enabledDesc: "Turning this off stops notifications and keeps your preference.",
  permission: "Notification permission",
  permissionGranted: "Granted",
  permissionDenied: "Denied (allow DeepSeek Harness in System Settings \u2192 Notifications)",
  permissionDefault: "Not granted",
  permissionUnsupported: "System notifications are unavailable in this environment",
  request: "Request permission",
  test: "Send a test notification",
  testTitle: "DeepSeek Harness",
  testBody: "Test notification: configuration works.",
  testSent: "Test notification sent. If you did not see it, check system notifications and Focus.",
  testFailed: "Could not send a test notification: {message}",
  bodyOk: "Completed",
  bodyFail: "Failed",
  unreadOk: "Completed \u2014 unread",
  unreadFail: "Failed \u2014 unread"
};

// src/client/SettingsSection.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function currentPermission() {
  return typeof Notification === "undefined" ? "unsupported" : Notification.permission;
}
function permissionKey(permission) {
  switch (permission) {
    case "granted":
      return "permissionGranted";
    case "denied":
      return "permissionDenied";
    case "unsupported":
      return "permissionUnsupported";
    default:
      return "permissionDefault";
  }
}
function SettingsSection(props) {
  const { useSettings, set, requestPermission, sendTest, t } = props;
  const settings = useSettings((snapshot) => snapshot);
  const [permission, setPermission] = (0, import_react.useState)(currentPermission);
  const [hint, setHint] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    const refresh = () => setPermission(currentPermission());
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const request = async () => {
    const next = await requestPermission();
    setPermission(next);
    setHint(null);
  };
  const test = async () => {
    let current = currentPermission();
    if (current !== "granted" && current !== "unsupported") {
      current = await requestPermission();
      setPermission(current);
    }
    if (current !== "granted") {
      setHint({ text: t(permissionKey(current)), error: true });
      return;
    }
    const result = sendTest();
    setHint(result.ok ? { text: t("testSent"), error: false } : { text: t("testFailed", { message: result.message ?? "" }), error: true });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dsh-macos-notify-section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t("title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("description") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-macos-notify-row", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          type: "checkbox",
          checked: settings?.enabled ?? true,
          onChange: (event) => set({ enabled: event.target.checked })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("enabled") })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("enabledDesc") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-macos-notify-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-macos-notify-hint", children: [
        t("permission"),
        ": ",
        t(permissionKey(permission))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => {
        void request();
      }, children: t("request") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => {
        void test();
      }, children: t("test") })
    ] }),
    hint === null ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: hint.error ? "dsh-macos-notify-error" : "dsh-macos-notify-hint", "aria-live": "polite", children: hint.text })
  ] });
}

// src/client/store.ts
function defaultSettings() {
  return { enabled: true };
}
function defaultReadStorage() {
  return typeof localStorage === "undefined" ? void 0 : localStorage;
}
function defaultWriteStorage() {
  return typeof localStorage === "undefined" ? void 0 : localStorage;
}
function loadSettings(storage = defaultReadStorage()) {
  if (storage === void 0) return defaultSettings();
  try {
    const raw = storage.getItem(SETTINGS_KEY);
    if (raw === null) return defaultSettings();
    const parsed = JSON.parse(raw);
    return { enabled: parsed.enabled !== false };
  } catch {
    return defaultSettings();
  }
}
function saveSettings(settings, storage = defaultWriteStorage()) {
  if (storage === void 0) return;
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
  }
}
function createSettingsStore() {
  let value = loadSettings();
  const listeners = /* @__PURE__ */ new Set();
  return {
    getSnapshot: () => value,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    update: (mutator) => {
      const next = { ...value };
      mutator(next);
      value = next;
      saveSettings(next);
      for (const listener of [...listeners]) listener();
    }
  };
}

// src/client/styles.ts
var STYLE_ID = "dsh-macos-notify-styles";
var STYLE_TEXT = [
  ".dsh-macos-notify-section { display: flex; flex-direction: column; gap: 14px; }",
  ".dsh-macos-notify-section h2 { margin: 0; font-size: 16px; font-weight: 600; }",
  ".dsh-macos-notify-section p { margin: 0; font-size: 12px; line-height: 1.5; color: var(--dsh-text-secondary, #6b7280); }",
  ".dsh-macos-notify-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }",
  ".dsh-macos-notify-row label { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; }",
  ".dsh-macos-notify-row button { font-size: 12px; padding: 4px 10px; border-radius: 6px; border: 1px solid var(--dsh-border, rgba(0,0,0,.15)); background: transparent; cursor: pointer; }",
  ".dsh-macos-notify-hint { font-size: 12px; color: var(--dsh-text-secondary, #6b7280); }",
  ".dsh-macos-notify-error { font-size: 12px; color: #d93025; }",
  ".dsh-macos-notify-unread-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #34c759; box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08); }",
  '.dsh-macos-notify-unread-dot[data-kind="fail"] { background: #ff3b30; }'
].join("\n");
function injectStyles() {
  if (typeof document === "undefined") return () => void 0;
  if (document.getElementById(STYLE_ID) !== null) return () => void 0;
  const element = document.createElement("style");
  element.id = STYLE_ID;
  element.textContent = STYLE_TEXT;
  document.head.appendChild(element);
  return () => {
    document.getElementById(STYLE_ID)?.remove();
  };
}

// src/client/UnreadDot.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function createUnreadDotEntry(store, t) {
  return function UnreadDot({ sessionId }) {
    const unread = (0, import_react2.useSyncExternalStore)(store.subscribe, store.getSnapshot);
    const kind = unread.get(sessionId);
    if (kind === void 0) return null;
    const label = t(kind === "ok" ? "unreadOk" : "unreadFail");
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "span",
      {
        className: "dsh-macos-notify-unread-dot",
        "data-kind": kind,
        role: "img",
        "aria-label": label,
        title: label
      }
    );
  };
}

// src/client/unread-store.ts
function createUnreadStore() {
  let value = /* @__PURE__ */ new Map();
  const listeners = /* @__PURE__ */ new Set();
  const emit = (next) => {
    value = next;
    for (const listener of [...listeners]) listener();
  };
  return {
    getSnapshot: () => value,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set: (sessionId, kind) => {
      if (value.get(sessionId) === kind) return;
      const next = new Map(value);
      next.set(sessionId, kind);
      emit(next);
    },
    delete: (sessionId) => {
      if (!value.has(sessionId)) return;
      const next = new Map(value);
      next.delete(sessionId);
      emit(next);
    },
    clear: () => {
      if (value.size === 0) return;
      emit(/* @__PURE__ */ new Map());
    }
  };
}

// src/client/index.ts
var inject = ["sessions", "slots", "locale", "uiWorkspace"];
function notificationApi() {
  return typeof Notification === "undefined" ? void 0 : Notification;
}
function pageHasFocus() {
  return typeof document === "undefined" ? false : document.hasFocus();
}
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(LOCALE_NS, { zh, en }), "dsh-macos-notify: dictionaries");
  ctx.effect(() => injectStyles(), "dsh-macos-notify: styles");
  const t = ctx.locale.bind(LOCALE_NS);
  const sessions = ctx.get("sessions");
  const workspace = ctx.get("uiWorkspace");
  const settings = createSettingsStore();
  const unread = createUnreadStore();
  if (sessions === void 0) {
    console.warn("dsh-macos-notify: sessions service unavailable; notifications disabled");
    return;
  }
  const show = (title, body, tag, sessionId) => {
    const api = notificationApi();
    if (api === void 0 || api.permission !== "granted") return;
    try {
      const notification = new api(title, { body, tag });
      notification.onclick = () => {
        unread.delete(sessionId);
        try {
          window.focus();
        } catch {
        }
        try {
          workspace?.openSession(sessionId);
        } catch (error) {
          console.error("dsh-macos-notify: opening the session failed", error);
        }
        try {
          notification.close();
        } catch {
        }
      };
    } catch (error) {
      console.error("dsh-macos-notify: creating the notification failed", error);
    }
  };
  const observedTurn = /* @__PURE__ */ new Map();
  let previousMain = /* @__PURE__ */ new Set();
  const observe = () => {
    const state = sessions.list.getSnapshot();
    const current = settings.getSnapshot();
    const focused = pageHasFocus();
    const mainNow = /* @__PURE__ */ new Set();
    for (const id of state.ids) {
      const summary = state.byId[id];
      if (summary === void 0) continue;
      if (summary.running === true) unread.delete(id);
      if ((summary.retainedBy?.mainView ?? 0) > 0) mainNow.add(id);
      const projection = summary.projectionValues?.[PROJECTION_KEY];
      const { nextTurn, fresh } = projectionAdvance(observedTurn.get(id), projection);
      if (nextTurn !== void 0) observedTurn.set(id, nextTurn);
      if (!fresh || nextTurn === void 0 || projection === void 0) continue;
      const outcome = decideTurnEnd(projection.reason);
      if (outcome === "silent") continue;
      if (shouldMarkUnread({
        enabled: current.enabled,
        origin: summary.origin,
        reason: projection.reason,
        focused
      })) {
        unread.set(id, outcome);
      }
      if (!shouldNotify({
        enabled: current.enabled,
        origin: summary.origin,
        reason: projection.reason,
        focused,
        permission: notificationApi()?.permission ?? "unsupported"
      })) continue;
      show(
        sessionTitle(summary),
        t(outcome === "ok" ? "bodyOk" : "bodyFail"),
        `dsh-macos-notify-${id}-${nextTurn}`,
        id
      );
    }
    for (const id of mainNow) {
      if (!previousMain.has(id) && unread.getSnapshot().has(id)) unread.delete(id);
    }
    previousMain = mainNow;
    const live = new Set(state.ids);
    for (const id of [...observedTurn.keys()]) {
      if (!live.has(id)) {
        observedTurn.delete(id);
        unread.delete(id);
      }
    }
  };
  ctx.effect(() => {
    const stopList = sessions.list.subscribe(observe);
    const stopReset = ctx.on("connection/reset", () => {
      observedTurn.clear();
      observe();
    });
    observe();
    return () => {
      stopList();
      stopReset();
    };
  }, "dsh-macos-notify: turn completion watch");
  ctx.effect(() => {
    const onClick = (event) => {
      const target = event.target;
      if (target === null) return;
      if (target.closest('button, [role="menu"], [role="menuitem"]') !== null) return;
      const row = target.closest('[data-row-key^="session:"]');
      if (!(row instanceof HTMLElement)) return;
      const key = row.dataset.rowKey;
      if (key === void 0) return;
      unread.delete(key.slice("session:".length));
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, "dsh-macos-notify: unread clear on session row click");
  const injected = () => ({
    hooks: { settings },
    set: (patch) => {
      settings.update((draft) => {
        if (typeof patch.enabled === "boolean") draft.enabled = patch.enabled;
      });
    },
    requestPermission: async () => {
      const api = notificationApi();
      if (api === void 0) return "denied";
      if (api.permission === "granted") return api.permission;
      try {
        return await api.requestPermission();
      } catch {
        return "denied";
      }
    },
    sendTest: () => {
      const api = notificationApi();
      if (api === void 0) return { ok: false, message: t("permissionUnsupported") };
      if (api.permission !== "granted") return { ok: false, message: t("permissionDefault") };
      try {
        const notification = new api(t("testTitle"), {
          body: t("testBody"),
          tag: `dsh-macos-notify-test-${Date.now()}`
        });
        notification.onclick = () => {
          try {
            notification.close();
          } catch {
          }
        };
        return { ok: true };
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : String(error) };
      }
    }
  });
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "dsh-macos-notify",
    order: 40,
    label: () => t("nav"),
    locale: LOCALE_NS,
    inject: injected
  }, SettingsSection));
  ctx.slots.inject("sidebar.session.row.leading", function* () {
    yield ctx.slots.register({
      name: "sidebar.session.row.leading",
      id: "dsh-macos-notify-unread",
      order: 10
    }, createUnreadDotEntry(unread, t));
  });
}
return module.exports; } });
//# sourceMappingURL=client.js.map
