'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useUi } from '@hit/ui-kit';

type TraceDetailResponse = {
  enabled?: boolean;
  run?: Record<string, unknown> | null;
};

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('hit_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchAi<T>(path: string): Promise<T> {
  const res = await fetch(`/api/proxy/ai${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    const detail = (body as any)?.detail || (body as any)?.message || res.statusText;
    throw new Error(String(detail || `Request failed: ${res.status}`));
  }
  return res.json();
}

function JsonBlock({ value }: { value: unknown }) {
  const s = useMemo(() => JSON.stringify(value, null, 2), [value]);
  return (
    <pre className="text-xs whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-3 overflow-auto max-h-[70vh]">
      {s}
    </pre>
  );
}

export function AiTraceDetail(props: { correlationId: string; onNavigate?: (path: string) => void }) {
  const { Page, Card, Button, Alert, Badge } = useUi();
  const [run, setRun] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const navigate = (path: string) => {
    if (props.onNavigate) props.onNavigate(path);
    else if (typeof window !== 'undefined') window.location.href = path;
  };

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAi<TraceDetailResponse>(
        `/hit/ai/traces/${encodeURIComponent(props.correlationId)}`
      );
      setRun((data?.run as any) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load trace'));
    } finally {
      setLoading(false);
    }
  }, [props.correlationId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pulses = Array.isArray((run as any)?.pulses) ? ((run as any).pulses as any[]) : [];
  const toolExecs = Array.isArray((run as any)?.toolExecs) ? ((run as any).toolExecs as any[]) : [];
  const pack = (run as any)?.decision?.pack || (run as any)?.agent?.pack || null;

  return (
    <Page
      title="AI Trace"
      description={
        pack ? `correlationId: ${props.correlationId} (pack: ${String(pack)})` : `correlationId: ${props.correlationId}`
      }
      actions={
        <div className="flex gap-2 items-center">
          <Button variant="secondary" onClick={() => navigate('/admin/ai/traces')}>
            Back
          </Button>
          <Button variant="primary" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        </div>
      }
    >
      {error && (
        <Alert variant="error" title="Error loading AI trace">
          {error.message}
        </Alert>
      )}

      <div className="flex gap-3 flex-wrap mb-3">
        <Badge variant="info">pulses: {pulses.length}</Badge>
        <Badge variant="info">toolExecs: {toolExecs.length}</Badge>
      </div>

      <Card>
        <JsonBlock value={run} />
      </Card>
    </Page>
  );
}

export default AiTraceDetail;

