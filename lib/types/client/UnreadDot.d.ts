import type { UnreadStore } from './unread-store';
export interface UnreadDotProps {
    sessionId: string;
}
export declare function createUnreadDotEntry(store: UnreadStore, t: (key: string, vars?: Record<string, string>) => string): ({ sessionId }: UnreadDotProps) => JSX.Element | null;
//# sourceMappingURL=UnreadDot.d.ts.map