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
    history?: Array<{
        role: string;
        content: string;
    }>;
    pulses: Array<{
        actor?: string;
        kind?: string;
        message?: string;
    }>;
    toolExecs: Array<Record<string, unknown>>;
};
export declare function recordChatTrace(trace: ChatTraceRun): void;
export declare function getChatTrace(correlationId: string): ChatTraceRun | null;
type TraceListFilters = {
    search?: string | null;
    pack?: string | null;
    kind?: string | null;
    limit?: number;
    offset?: number;
};
export declare function listChatTraces(filters: TraceListFilters): {
    runs: Array<Pick<ChatTraceRun, 'correlationId' | 'createdAt' | 'pack' | 'kind'>>;
    total: number;
    limit: number;
    offset: number;
};
export {};
//# sourceMappingURL=trace-store.d.ts.map