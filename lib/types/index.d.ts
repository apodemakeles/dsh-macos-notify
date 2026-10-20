/** Cordis plugin name (the Loader entry and client bundle id). */
export declare const name = "dsh-macos-notify";
/** Required service: the projection registry. */
export declare const inject: string[];
interface HostContext {
    sessionProjections: {
        register(definition: unknown): () => void;
    };
}
export declare function apply(ctx: HostContext): void;
export {};
//# sourceMappingURL=index.d.ts.map