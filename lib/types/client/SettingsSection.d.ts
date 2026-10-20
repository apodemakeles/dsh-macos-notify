import type { TurnNotifySettings } from '../shared';
import type { SnapshotStore } from './store';
export interface SettingsSectionInjected {
    hooks: {
        settings: SnapshotStore<TurnNotifySettings>;
    };
    set: (patch: Partial<TurnNotifySettings>) => void;
    requestPermission: () => Promise<NotificationPermission>;
    sendTest: () => {
        ok: boolean;
        message?: string;
    };
}
export interface SettingsSectionProps extends SettingsSectionInjected {
    useSettings: <T>(selector: (snapshot: TurnNotifySettings) => T) => T;
    t: (key: string, vars?: Record<string, string>) => string;
}
export declare function SettingsSection(props: SettingsSectionProps): JSX.Element;
//# sourceMappingURL=SettingsSection.d.ts.map