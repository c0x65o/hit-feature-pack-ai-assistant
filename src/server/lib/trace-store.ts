export type ChatTraceRun = {
  correlationId: string;
  createdAt: string;
  pack: 'ai-core';
  kind: 'chat';
  message: string;
  reply: string;
  user: {
    userId: string;
    email: string;
  };
  history?: Array<{ role: string; content: string }>;
  pulses: Array<{ actor?: string; kind?: string; message?: string }>;
  toolExecs: Array<Record<string, unknown>>;
};

const traceStore = new Map<string, ChatTraceRun>();

export function recordChatTrace(trace: ChatTraceRun): void {
  traceStore.set(trace.correlationId, trace);
}

export function getChatTrace(correlationId: string): ChatTraceRun | null {
  return traceStore.get(correlationId) ?? null;
}

type TraceListFilters = {
  search?: string | null;
  pack?: string | null;
  kind?: string | null;
  limit?: number;
  offset?: number;
};

export function listChatTraces(filters: TraceListFilters): {
  runs: Array<Pick<ChatTraceRun, 'correlationId' | 'createdAt' | 'pack' | 'kind'>>;
  total: number;
  limit: number;
  offset: number;
} {
  const search = (filters.search ?? '').trim().toLowerCase();
  const pack = (filters.pack ?? '').trim().toLowerCase();
  const kind = (filters.kind ?? '').trim().toLowerCase();

  const all = Array.from(traceStore.values())
    .filter((run) => {
      if (pack && run.pack.toLowerCase() !== pack) return false;
      if (kind && run.kind.toLowerCase() !== kind) return false;
      if (!search) return true;
      return (
        run.correlationId.toLowerCase().includes(search) ||
        run.message.toLowerCase().includes(search) ||
        run.reply.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const limit = Math.max(1, Math.min(200, filters.limit ?? 50));
  const offset = Math.max(0, filters.offset ?? 0);
  const page = all.slice(offset, offset + limit);

  return {
    runs: page.map((run) => ({
      correlationId: run.correlationId,
      createdAt: run.createdAt,
      pack: run.pack,
      kind: run.kind,
    })),
    total: all.length,
    limit,
    offset,
  };
}
