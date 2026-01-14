import { NextRequest, NextResponse } from 'next/server';
import type { ActionCheckResult } from '@hit/feature-pack-auth-core/server/lib/action-check';
import {
  checkActionPermission,
  requireActionPermission,
} from '@hit/feature-pack-auth-core/server/lib/action-check';

export async function checkAiCoreAction(
  request: NextRequest,
  actionKey: string
): Promise<ActionCheckResult> {
  return checkActionPermission(request, actionKey, { logPrefix: 'AI-Core' });
}

export async function requireAiCoreAction(
  request: NextRequest,
  actionKey: string
): Promise<NextResponse | null> {
  return requireActionPermission(request, actionKey, { logPrefix: 'AI-Core' });
}
