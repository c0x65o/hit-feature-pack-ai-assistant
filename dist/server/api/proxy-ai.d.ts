/**
 * AI Module Proxy Route (with authentication)
 *
 * Overrides the generic module proxy for the AI module to require auth.
 */
import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
type RouteContext = {
    params: Promise<{
        path: string[];
    }>;
};
export declare function GET(req: NextRequest, context: RouteContext): Promise<NextResponse<unknown>>;
export declare function POST(req: NextRequest, context: RouteContext): Promise<NextResponse<unknown>>;
export declare function PUT(req: NextRequest, context: RouteContext): Promise<NextResponse<unknown>>;
export declare function PATCH(req: NextRequest, context: RouteContext): Promise<NextResponse<unknown>>;
export declare function DELETE(req: NextRequest, context: RouteContext): Promise<NextResponse<unknown>>;
export declare function OPTIONS(): Promise<NextResponse<unknown>>;
export {};
//# sourceMappingURL=proxy-ai.d.ts.map