import type { ActionCheckResult } from '@hit/feature-pack-auth-core/server/lib/action-check';
export declare function checkAiCoreAction(request: Request, actionKey: string): Promise<ActionCheckResult>;
export declare function requireAiCoreAction(request: Request, actionKey: string): Promise<Response | null>;
//# sourceMappingURL=require-action.d.ts.map