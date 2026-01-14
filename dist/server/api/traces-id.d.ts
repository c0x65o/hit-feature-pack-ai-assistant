import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};
export declare function GET(request: NextRequest, context: RouteContext): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    enabled: boolean;
    run: null;
}> | NextResponse<{
    enabled: boolean;
    run: {
        correlationId: string;
        createdAt: string;
        message: string;
        reply: string;
        user: {
            userId: string;
            email: string;
        };
        history: {
            role: string;
            content: string;
        }[];
        pulses: {
            actor?: string;
            kind?: string;
            message?: string;
        }[];
        toolExecs: Record<string, unknown>[];
        agent: {
            pack: "ai-core";
            kind: "chat";
        };
    };
}>>;
export {};
//# sourceMappingURL=traces-id.d.ts.map