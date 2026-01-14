import { checkActionPermission, requireActionPermission, } from '@hit/feature-pack-auth-core/server/lib/action-check';
export async function checkAiCoreAction(request, actionKey) {
    return checkActionPermission(request, actionKey, { logPrefix: 'AI-Core' });
}
export async function requireAiCoreAction(request, actionKey) {
    return requireActionPermission(request, actionKey, { logPrefix: 'AI-Core' });
}
