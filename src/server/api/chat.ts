import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { extractUserFromRequest } from '../auth';
import { recordChatTrace } from '../lib/trace-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type ChatRequest = {
  message?: string;
  history?: Array<{ role?: string; content?: string }>;
};

export async function POST(request: NextRequest) {
  const user = extractUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const safeMessage = message.slice(0, 4000);
  const correlationId = randomUUID();
  const reply = [
    'I am a basic chat bot running in TypeScript (no tools enabled).',
    '',
    `You said: ${safeMessage}`,
  ].join('\n');

  recordChatTrace({
    correlationId,
    createdAt: new Date().toISOString(),
    pack: 'ai-core',
    kind: 'chat',
    message: safeMessage,
    reply,
    user: { userId: user.userId, email: user.email },
    history: Array.isArray(body.history)
      ? body.history
          .filter((h) => typeof h?.content === 'string')
          .slice(-16)
          .map((h) => ({ role: String(h?.role ?? 'user'), content: String(h?.content ?? '') }))
      : [],
    pulses: [],
    toolExecs: [],
  });

  return NextResponse.json({ reply, correlationId, pulses: [] }, { status: 200 });
}
