/**
 * Client-owned settings: one tiny snapshot store persisted in localStorage.
 * The host projection carries no preferences; the browser is the single
 * source of truth for the switch.
 */
import { type TurnNotifySettings } from '../shared';
export interface SnapshotStore<T> {
    getSnapshot(): T;
    subscribe(listener: () => void): () => void;
    update(mutator: (draft: T) => void): void;
}
export declare function defaultSettings(): TurnNotifySettings;
type ReadStorage = Pick<Storage, 'getItem'>;
type WriteStorage = Pick<Storage, 'setItem'>;
export declare function loadSettings(storage?: ReadStorage | undefined): TurnNotifySettings;
export declare function saveSettings(settings: TurnNotifySettings, storage?: WriteStorage | undefined): void;
export declare function createSettingsStore(): SnapshotStore<TurnNotifySettings>;
export {};
//# sourceMappingURL=store.d.ts.map