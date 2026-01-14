import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
export declare function GET(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    enabled: boolean;
    runsDir: null;
    runs: Pick<import("../lib/trace-store").ChatTraceRun, "correlationId" | "createdAt" | "pack" | "kind">[];
    total: number;
    limit: number;
    offset: number;
}>>;
//# sourceMappingURL=traces.d.ts.map