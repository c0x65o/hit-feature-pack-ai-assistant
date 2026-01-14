const traceStore = new Map();
export function recordChatTrace(trace) {
    traceStore.set(trace.correlationId, trace);
}
export function getChatTrace(correlationId) {
    return traceStore.get(correlationId) ?? null;
}
export function listChatTraces(filters) {
    const search = (filters.search ?? '').trim().toLowerCase();
    const pack = (filters.pack ?? '').trim().toLowerCase();
    const kind = (filters.kind ?? '').trim().toLowerCase();
    const all = Array.from(traceStore.values())
        .filter((run) => {
        if (pack && run.pack.toLowerCase() !== pack)
            return false;
        if (kind && run.kind.toLowerCase() !== kind)
            return false;
        if (!search)
            return true;
        return (run.correlationId.toLowerCase().includes(search) ||
            run.message.toLowerCase().includes(search) ||
            run.reply.toLowerCase().includes(search));
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
