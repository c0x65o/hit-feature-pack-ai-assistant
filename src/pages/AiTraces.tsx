'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useServerDataTableState, useUi } from '@hit/ui-kit';

type RunSummary = {
  correlationId: string;
  createdAt?: string | null;
  pack?: string | null;
  kind?: string | null;
  file?: string | null;
};

type RunsIndexResponse = {
  enabled?: boolean;
  runsDir?: string | null;
  runs?: RunSummary[];
  total?: number;
  limit?: number;
  offset?: number;
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

function formatWhen(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export function AiTraces() {
  const { Page, Card, Button, DataTable, Alert, Badge } = useUi();
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [runsDir, setRunsDir] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
      if (serverTable.query.search) params.set('search', serverTable.query.search);
      const pack = (serverTable.quickFilterValues as any)?.pack;
      const kind = (serverTable.quickFilterValues as any)?.kind;
      if (typeof pack === 'string' && pack.trim()) params.set('pack', pack.trim());
      if (typeof kind === 'string' && kind.trim()) params.set('kind', kind.trim());
      const data = await fetchAi<RunsIndexResponse>(`/hit/ai/traces?${params.toString()}`);
      setRuns(Array.isArray(data?.runs) ? data.runs : []);
      setRunsDir(typeof data?.runsDir === 'string' ? data.runsDir : null);
      setTotal(typeof data?.total === 'number' ? data.total : 0);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load AI traces'));
    } finally {
      setLoading(false);
    }
  }, [serverTable.query.page, serverTable.query.pageSize, serverTable.query.search, serverTable.quickFilterValues]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const rows = useMemo(() => runs, [runs]);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') window.location.href = path;
  };

  return (
    <Page
      title="AI Traces"
      description="Admin-only per-run telemetry for the Nexus + pack agents"
      actions={
        <div className="flex gap-2 items-center">
          <Button variant="primary" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        </div>
      }
    >
      {runsDir && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Trace storage: <span className="font-mono">{runsDir}</span>
        </div>
      )}
      {error && (
        <Alert variant="error" title="Error loading AI traces">
          {error.message}
        </Alert>
      )}
      <Card>
        <DataTable
          loading={loading}
          data={rows as any[]}
          emptyMessage="No traces yet. Traces will appear here as the AI assistant is used."
          searchable
          exportable
          showColumnVisibility
          onRefresh={refresh}
          refreshing={loading}
          searchDebounceMs={400}
          total={total}
          {...serverTable.dataTable}
          columns={[
            {
              key: 'createdAt',
              label: 'When',
              render: (value: unknown) => (
                <span className="text-sm">{formatWhen(typeof value === 'string' ? value : null)}</span>
              ),
            },
            {
              key: 'correlationId',
              label: 'Correlation ID',
              sortable: true,
              render: (value: unknown) => (
                <span
                  role="button"
                  tabIndex={0}
                  className="font-mono text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => navigate(`/admin/ai/traces/${encodeURIComponent(String(value))}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/admin/ai/traces/${encodeURIComponent(String(value))}`);
                    }
                  }}
                >
                  {String(value)}
                </span>
              ),
            },
            {
              key: 'pack',
              label: 'Pack',
              sortable: true,
              render: (value: unknown) =>
                value ? <Badge variant="info">{String(value)}</Badge> : <span className="text-gray-500">—</span>,
            },
            {
              key: 'kind',
              label: 'Kind',
              render: (value: unknown) =>
                value ? <Badge variant="default">{String(value)}</Badge> : <span className="text-gray-500">—</span>,
            },
          ]}
        />
      </Card>
    </Page>
  );
}

export default AiTraces;

