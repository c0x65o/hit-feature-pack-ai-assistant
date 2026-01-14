'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUi } from '@hit/ui-kit';
function getAuthHeaders() {
    if (typeof window === 'undefined')
        return {};
    const token = localStorage.getItem('hit_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}
async function fetchAi(path) {
    const res = await fetch(`/api/ai${path}`, {
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
function JsonBlock({ value }) {
    const s = useMemo(() => JSON.stringify(value, null, 2), [value]);
    return (_jsx("pre", { className: "text-xs whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-3 overflow-auto max-h-[70vh]", children: s }));
}
export function AiTraceDetail(props) {
    const { Page, Card, Button, Alert, Badge } = useUi();
    const [run, setRun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = (path) => {
        if (props.onNavigate)
            props.onNavigate(path);
        else if (typeof window !== 'undefined')
            window.location.href = path;
    };
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchAi(`/traces/${encodeURIComponent(props.correlationId)}`);
            setRun(data?.run ?? null);
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Failed to load trace'));
        }
        finally {
            setLoading(false);
        }
    }, [props.correlationId]);
    useEffect(() => {
        refresh();
    }, [refresh]);
    const pulses = Array.isArray(run?.pulses) ? run.pulses : [];
    const toolExecs = Array.isArray(run?.toolExecs) ? run.toolExecs : [];
    const pack = run?.decision?.pack || run?.agent?.pack || null;
    return (_jsxs(Page, { title: "AI Trace", description: pack ? `correlationId: ${props.correlationId} (pack: ${String(pack)})` : `correlationId: ${props.correlationId}`, actions: _jsxs("div", { className: "flex gap-2 items-center", children: [_jsx(Button, { variant: "secondary", onClick: () => navigate('/admin/ai/traces'), children: "Back" }), _jsx(Button, { variant: "primary", onClick: refresh, disabled: loading, children: "Refresh" })] }), children: [error && (_jsx(Alert, { variant: "error", title: "Error loading AI trace", children: error.message })), _jsxs("div", { className: "flex gap-3 flex-wrap mb-3", children: [_jsxs(Badge, { variant: "info", children: ["pulses: ", pulses.length] }), _jsxs(Badge, { variant: "info", children: ["toolExecs: ", toolExecs.length] })] }), _jsx(Card, { children: _jsx(JsonBlock, { value: run }) })] }));
}
export default AiTraceDetail;
