// Obilaznica Sync Worker
// GET  /sync/:uuid  → vrati posjećene vrhove
// POST /sync/:uuid  → spremi posjećene vrhove
// DELETE /sync/:uuid → briši sve (reset)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);

    // Očekujemo: /sync/:uuid
    if (parts[0] !== 'sync' || !parts[1]) {
      return new Response('Not Found', { status: 404, headers: CORS });
    }

    const uuid = parts[1];

    // Validacija UUID formata (osnovna)
    if (!/^[0-9a-f-]{36}$/i.test(uuid)) {
      return new Response('Invalid UUID', { status: 400, headers: CORS });
    }

    if (request.method === 'GET') {
      const data = await env.OBILAZNICA_KV.get(uuid);
      if (!data) {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }
      return new Response(data, {
        status: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch {
        return new Response('Invalid JSON', { status: 400, headers: CORS });
      }

      if (!Array.isArray(body)) {
        return new Response('Expected array of IDs', { status: 400, headers: CORS });
      }

      // Spremi max 30 dana
      await env.OBILAZNICA_KV.put(uuid, JSON.stringify(body), {
        expirationTtl: 60 * 60 * 24 * 30,
      });

      return new Response(JSON.stringify({ ok: true, count: body.length }), {
        status: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'DELETE') {
      await env.OBILAZNICA_KV.delete(uuid);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method Not Allowed', { status: 405, headers: CORS });
  },
};
