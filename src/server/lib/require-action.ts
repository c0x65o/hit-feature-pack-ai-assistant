import type { ActionCheckResult } from '@hit/feature-pack-auth-core/server/lib/action-check';
import {
  checkActionPermission,
  requireActionPermission,
} from '@hit/feature-pack-auth-core/server/lib/action-check';

export async function checkAiCoreAction(
  request: Request,
  actionKey: string
): Promise<ActionCheckResult> {
  return checkActionPermission(request, actionKey, { logPrefix: 'AI-Core' });
}

export async function requireAiCoreAction(
  request: Request,
  actionKey: string
): Promise<Response | null> {
  return requireActionPermission(request, actionKey, { logPrefix: 'AI-Core' });
}
