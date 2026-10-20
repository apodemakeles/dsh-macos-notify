/**
 * Host half: register the `turn-notify` projection. Everything else (focus
 * gate, relevance, title, notification, click) lives in the browser half.
 */
import { turnNotifyProjection } from './projection'

/** Cordis plugin name (the Loader entry and client bundle id). */
export const name = 'dsh-macos-notify'

/** Required service: the projection registry. */
export const inject = ['sessionProjections']

interface HostContext {
  sessionProjections: {
    register(definition: unknown): () => void
  }
}

export function apply(ctx: HostContext): void {
  ctx.sessionProjections.register(turnNotifyProjection())
  console.info('[dsh-macos-notify] turn-notify projection registered')
}
