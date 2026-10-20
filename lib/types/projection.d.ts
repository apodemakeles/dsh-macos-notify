/**
 * The `turn-notify` session projection: a pure fold that remembers the last
 * ended turn and its `turn/end` reason. The projection seam replays every
 * committed event and delivers the wire view to the client for every session,
 * so the browser can distinguish completed / error / aborted without a route
 * or a second event channel.
 */
import { z } from 'zod';
import { type TurnNotifyProjectionValue } from './shared';
export interface TurnNotifyProjectionState {
    /** Turn currently open, null outside a turn. */
    openTurn: number | null;
    /** Last ended turn, null before the first one. */
    last: TurnNotifyProjectionValue | null;
}
interface SessionEventLike {
    type: string;
    data?: {
        turn?: number;
        reason?: {
            kind?: string;
        };
    };
}
export declare const EMPTY_PROJECTION: TurnNotifyProjectionValue;
/**
 * Apply one committed session event. Uninteresting events return the same
 * state reference so the projection drive publishes nothing.
 */
export declare function applyProjectionEvent(state: TurnNotifyProjectionState, event: SessionEventLike): TurnNotifyProjectionState;
/** Build the projection unit registered on `ctx.sessionProjections`. */
export declare function turnNotifyProjection(): {
    key: string;
    stateSchema: z.ZodObject<{
        openTurn: z.ZodNullable<z.ZodNumber>;
        last: z.ZodNullable<z.ZodObject<{
            turn: z.ZodNumber;
            reason: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    init: () => TurnNotifyProjectionState;
    apply: typeof applyProjectionEvent;
    wire: {
        viewSchema: z.ZodObject<{
            turn: z.ZodNumber;
            reason: z.ZodString;
        }, z.core.$strict>;
        view: (state: TurnNotifyProjectionState) => TurnNotifyProjectionValue;
    };
    stateVersion: number;
};
export {};
//# sourceMappingURL=projection.d.ts.map