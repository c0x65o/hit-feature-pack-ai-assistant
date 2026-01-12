/**
 * AI Module Proxy Route (with authentication)
 *
 * Overrides the generic module proxy for the AI module to require auth.
 */
import { NextResponse } from 'next/server';
import { extractUserFromRequest } from '../auth';
import { resolveAiCoreScopeMode } from '../lib/scope-mode';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
function getAiModuleUrl() {
    const url = process.env.HIT_AI_URL;
    if (url)
        return url;
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8000';
    }
    return null;
}
function getClientIP(req) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        const ip = forwardedFor.split(',')[0]?.trim();
        if (ip)
            return ip;
    }
    const realIP = req.headers.get('x-real-ip');
    if (realIP)
        return realIP.trim();
    return null;
}
async function proxyRequest(req, pathSegments, method) {
    const user = extractUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized - authentication required for AI features' }, { status: 401 });
    }
    const path = pathSegments.join('/');
    // Enforce permissions for traces endpoints (entity-backed)
    if (path.startsWith('hit/ai/traces')) {
        const mode = await resolveAiCoreScopeMode(req, { entity: 'traces', verb: 'read' });
        // Explicit branching on all four modes (no "else bucket")
        if (mode === 'none') {
            return NextResponse.json({ error: 'Forbidden - access denied to AI traces' }, { status: 403 });
        }
        else if (mode === 'own') {
            // Traces don't have ownership fields, so 'own' mode denies access
            return NextResponse.json({ error: 'Forbidden - traces do not support ownership-based access' }, { status: 403 });
        }
        else if (mode === 'ldd') {
            // Traces don't have LDD fields, so 'ldd' mode denies access
            return NextResponse.json({ error: 'Forbidden - traces do not support LDD-based access' }, { status: 403 });
        }
        else if (mode === 'any') {
            // Allow access - continue to proxy
        }
        else {
            // Fallback: deny access
            return NextResponse.json({ error: 'Forbidden - invalid scope mode' }, { status: 403 });
        }
    }
    const moduleUrl = getAiModuleUrl();
    if (!moduleUrl) {
        return NextResponse.json({ error: 'AI module not configured' }, { status: 503 });
    }
    const url = new URL(req.url);
    const fullUrl = `${moduleUrl}/${path}${url.search}`;
    const headers = {
        'Content-Type': 'application/json',
    };
    // Forward auth header (or synthesize from cookie)
    let authHeader = req.headers.get('authorization');
    if (!authHeader) {
        const cookie = req.cookies.get('hit_token')?.value;
        if (cookie)
            authHeader = `Bearer ${cookie}`;
    }
    if (authHeader)
        headers['Authorization'] = authHeader;
    const clientIP = getClientIP(req);
    if (clientIP) {
        headers['X-Forwarded-For'] = clientIP;
        headers['X-Real-IP'] = clientIP;
    }
    const userAgent = req.headers.get('user-agent');
    if (userAgent) {
        headers['X-Forwarded-User-Agent'] = userAgent;
        headers['User-Agent'] = userAgent;
    }
    const serviceToken = process.env.HIT_SERVICE_TOKEN;
    if (serviceToken) {
        headers['X-HIT-Service-Token'] = serviceToken;
    }
    try {
        const fetchOptions = { method, headers, redirect: 'manual' };
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            const body = await req.text().catch(() => '');
            if (body)
                fetchOptions.body = body;
        }
        const response = await fetch(fullUrl, fetchOptions);
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            if (location) {
                return NextResponse.redirect(location, { status: response.status, headers: { 'X-Proxied-From': 'ai' } });
            }
        }
        const responseText = await response.text();
        let responseBody;
        try {
            responseBody = JSON.parse(responseText);
        }
        catch {
            responseBody = responseText;
        }
        return NextResponse.json(responseBody, { status: response.status, headers: { 'X-Proxied-From': 'ai' } });
    }
    catch {
        return NextResponse.json({ error: 'Failed to proxy request to AI module', path }, { status: 502 });
    }
}
export async function GET(req, context) {
    const { path } = await context.params;
    return proxyRequest(req, path, 'GET');
}
export async function POST(req, context) {
    const { path } = await context.params;
    return proxyRequest(req, path, 'POST');
}
export async function PUT(req, context) {
    const { path } = await context.params;
    return proxyRequest(req, path, 'PUT');
}
export async function PATCH(req, context) {
    const { path } = await context.params;
    return proxyRequest(req, path, 'PATCH');
}
export async function DELETE(req, context) {
    const { path } = await context.params;
    return proxyRequest(req, path, 'DELETE');
}
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
