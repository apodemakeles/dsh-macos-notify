/** Required client services. */
export declare const inject: string[];
interface SlotsFace {
    inject(name: string, factory: () => unknown): unknown;
    register(entry: object, component: unknown): unknown;
}
interface LocaleFace {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): unknown;
    bind(namespace: string): (key: string, vars?: Record<string, string>) => string;
}
interface ClientContext {
    effect(task: () => unknown, name?: string): void;
    on(event: string, listener: () => void): () => void;
    get(name: string): unknown;
    slots: SlotsFace;
    locale: LocaleFace;
}
export declare function apply(ctx: ClientContext): void;
export {};
//# sourceMappingURL=index.d.ts.map