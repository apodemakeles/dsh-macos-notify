/**
 * In-memory unread-completion store for the enhanced session-row dot. A mark
 * exists while a turn finished during window-unfocused time and the user has
 * not gone back to that session. It is intentionally not persisted: a plugin
 * reload starts from the official UI's own completion state.
 */
import type { TurnNotifyOutcome } from '../shared';
export type UnreadKind = TurnNotifyOutcome;
export interface UnreadStore {
    getSnapshot(): ReadonlyMap<string, UnreadKind>;
    subscribe(listener: () => void): () => void;
    set(sessionId: string, kind: UnreadKind): void;
    delete(sessionId: string): void;
    clear(): void;
}
export declare function createUnreadStore(): UnreadStore;
//# sourceMappingURL=unread-store.d.ts.map