import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    reply: string;
    correlationId: `${string}-${string}-${string}-${string}-${string}`;
    pulses: never[];
}>>;
//# sourceMappingURL=chat.d.ts.map