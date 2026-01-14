import { NextResponse } from 'next/server';
import { extractUserFromRequest } from '../auth';
import { listChatTraces } from '../lib/trace-store';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request) {
    const user = extractUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') ?? '50');
    const offset = Number(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const pack = searchParams.get('pack');
    const kind = searchParams.get('kind');
    const result = listChatTraces({
        search,
        pack,
        kind,
        limit: Number.isFinite(limit) ? limit : 50,
        offset: Number.isFinite(offset) ? offset : 0,
    });
    return NextResponse.json({
        enabled: true,
        runsDir: null,
        runs: result.runs,
        total: result.total,
        limit: result.limit,
        offset: result.offset,
    }, { status: 200 });
}
