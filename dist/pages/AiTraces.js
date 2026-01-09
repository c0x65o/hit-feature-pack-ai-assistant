'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUi } from '@hit/ui-kit';
import { useServerDataTableState } from '@hit/ui-kit/hooks/useServerDataTableState';
function getAuthHeaders() {
    if (typeof window === 'undefined')
        return {};
    const token = localStorage.getItem('hit_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}
async function fetchAi(path) {
    const res = await fetch(`/api/proxy/ai${path}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        const detail = body?.detail || body?.message || res.statusText;
        throw new Error(String(detail || `Request failed: ${res.status}`));
    }
    return res.json();
}
function formatWhen(iso) {
    if (!iso)
        return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return iso;
    return d.toLocaleString();
}
export function AiTraces() {
    const { Page, Card, Button, DataTable, Alert, Badge } = useUi();
    const [runs, setRuns] = useState([]);
    const [runsDir, setRunsDir] = useState(null);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const serverTable = useServerDataTableState({
        tableId: 'admin.ai.traces',
        pageSize: 50,
        initialSort: { sortBy: 'createdAt', sortOrder: 'desc' },
        // Sorting is handled in the AI module listing (newest first); keep whitelist minimal.
        sortWhitelist: ['createdAt', 'correlationId'],
    });
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const limit = serverTable.query.pageSize;
            const offset = (serverTable.query.page - 1) * serverTable.query.pageSize;
            const params = new URLSearchParams();
            params.set('limit', String(limit));
            params.set('offset', String(offset));
            if (serverTable.query.search)
                params.set('search', serverTable.query.search);
            const pack = serverTable.quickFilterValues?.pack;
            const kind = serverTable.quickFilterValues?.kind;
            if (typeof pack === 'string' && pack.trim())
                params.set('pack', pack.trim());
            if (typeof kind === 'string' && kind.trim())
                params.set('kind', kind.trim());
            const data = await fetchAi(`/hit/ai/traces?${params.toString()}`);
            setRuns(Array.isArray(data?.runs) ? data.runs : []);
            setRunsDir(typeof data?.runsDir === 'string' ? data.runsDir : null);
            setTotal(typeof data?.total === 'number' ? data.total : 0);
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Failed to load AI traces'));
        }
        finally {
            setLoading(false);
        }
    }, [serverTable.query.page, serverTable.query.pageSize, serverTable.query.search, serverTable.quickFilterValues]);
    useEffect(() => {
        refresh();
    }, [refresh]);
    const rows = useMemo(() => runs, [runs]);
    const navigate = (path) => {
        if (typeof window !== 'undefined')
            window.location.href = path;
    };
    return (_jsxs(Page, { title: "AI Traces", description: "Admin-only per-run telemetry for the Nexus + pack agents", actions: _jsx("div", { className: "flex gap-2 items-center", children: _jsx(Button, { variant: "primary", onClick: refresh, disabled: loading, children: "Refresh" }) }), children: [runsDir && (_jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400 mb-3", children: ["Trace storage: ", _jsx("span", { className: "font-mono", children: runsDir })] })), error && (_jsx(Alert, { variant: "error", title: "Error loading AI traces", children: error.message })), _jsx(Card, { children: _jsx(DataTable, { loading: loading, data: rows, emptyMessage: "No traces yet. Traces will appear here as the AI assistant is used.", searchable: true, exportable: true, showColumnVisibility: true, onRefresh: refresh, refreshing: loading, searchDebounceMs: 400, total: total, ...serverTable.dataTable, columns: [
                        {
                            key: 'createdAt',
                            label: 'When',
                            render: (value) => (_jsx("span", { className: "text-sm", children: formatWhen(typeof value === 'string' ? value : null) })),
                        },
                        {
                            key: 'correlationId',
                            label: 'Correlation ID',
                            sortable: true,
                            render: (value) => (_jsx("span", { role: "button", tabIndex: 0, className: "font-mono text-blue-600 dark:text-blue-400 hover:underline", onClick: () => navigate(`/admin/ai/traces/${encodeURIComponent(String(value))}`), onKeyDown: (e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        navigate(`/admin/ai/traces/${encodeURIComponent(String(value))}`);
                                    }
                                }, children: String(value) })),
                        },
                        {
                            key: 'pack',
                            label: 'Pack',
                            sortable: true,
                            render: (value) => value ? _jsx(Badge, { variant: "info", children: String(value) }) : _jsx("span", { className: "text-gray-500", children: "\u2014" }),
                        },
                        {
                            key: 'kind',
                            label: 'Kind',
                            render: (value) => value ? _jsx(Badge, { variant: "default", children: String(value) }) : _jsx("span", { className: "text-gray-500", children: "\u2014" }),
                        },
                    ] }) })] }));
}
export default AiTraces;
