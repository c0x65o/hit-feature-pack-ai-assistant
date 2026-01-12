import { checkAiCoreAction } from './require-action';
/**
 * Resolve effective scope mode using a tree:
 * - entity override: ai-core.{entity}.{verb}.scope.{mode}
 * - ai-core default: ai-core.{verb}.scope.{mode}
 * - fallback:        own
 *
 * Precedence if multiple are granted: most restrictive wins.
 */
export async function resolveAiCoreScopeMode(request, args) {
    const { entity, verb } = args;
    const entityPrefix = entity ? `ai-core.${entity}.${verb}.scope` : `ai-core.${verb}.scope`;
    const globalPrefix = `ai-core.${verb}.scope`;
    // Most restrictive wins (first match returned).
    const modes = ['none', 'own', 'ldd', 'any'];
    for (const m of modes) {
        const res = await checkAiCoreAction(request, `${entityPrefix}.${m}`);
        if (res.ok)
            return m;
    }
    for (const m of modes) {
        const res = await checkAiCoreAction(request, `${globalPrefix}.${m}`);
        if (res.ok)
            return m;
    }
    return 'own';
}
