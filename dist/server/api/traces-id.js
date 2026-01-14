import { NextResponse } from 'next/server';
import { extractUserFromRequest } from '../auth';
import { getChatTrace } from '../lib/trace-store';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request, context) {
    const user = extractUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await context.params;
    const trace = getChatTrace(id);
    if (!trace) {
        return NextResponse.json({ enabled: true, run: null }, { status: 200 });
    }
    return NextResponse.json({
        enabled: true,
        run: {
            correlationId: trace.correlationId,
            createdAt: trace.createdAt,
            message: trace.message,
            reply: trace.reply,
            user: trace.user,
            history: trace.history ?? [],
            pulses: trace.pulses,
            toolExecs: trace.toolExecs,
            agent: { pack: trace.pack, kind: trace.kind },
        },
    }, { status: 200 });
}
