import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { roomRequest, routeApi } from './api.js';

const rooms = new Map();
const publicFiles = {
  '/': ['index.html', 'text/html'],
  '/index.html': ['index.html', 'text/html'],
  '/style.css': ['style.css', 'text/css'],
  '/app.js': ['app.js', 'text/javascript'],
  '/content.js': ['content.js', 'text/javascript'],
};

function getStorage(code) {
  if (rooms.has(code)) return rooms.get(code);
  let room;
  let pending = Promise.resolve();
  const storage = {
    async get() { return structuredClone(room); },
    async put(_key, next) { room = structuredClone(next); },
    async setAlarm(expires) { setTimeout(() => rooms.delete(code), expires - Date.now()).unref(); },
    transaction(operation) {
      const result = pending.then(() => operation(storage));
      pending = result.catch(() => {});
      return result;
    },
  };
  rooms.set(code, storage);
  return storage;
}

async function handle(request) {
  const { pathname } = new URL(request.url);
  if (pathname.startsWith('/api/')) {
    return routeApi(request, (code, forwarded) => roomRequest(forwarded, getStorage(code), code));
  }
  const asset = Object.hasOwn(publicFiles, pathname) && publicFiles[pathname];
  if (!asset) return new Response('Osoitetta ei löytynyt.', { status: 404 });
  return new Response(await readFile(new URL(`../public/${asset[0]}`, import.meta.url)), {
    headers: { 'Content-Type': `${asset[1]}; charset=utf-8` },
  });
}

const port = Number(process.env.KYLMA_SOTA_PORT ?? 8787);
const host = process.env.KYLMA_SOTA_HOST ?? '127.0.0.1';
createServer(async (incoming, outgoing) => {
  try {
    const body = incoming.method === 'GET' || incoming.method === 'HEAD' ? undefined : Readable.toWeb(incoming);
    const request = new Request(new URL(incoming.url, `http://${incoming.headers.host}`), {
      method: incoming.method, headers: incoming.headers, body, duplex: 'half',
    });
    const response = await handle(request);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    outgoing.writeHead(500).end('Palvelinvirhe.');
  }
}).listen(port, host, () => console.log(`Kylmä sota: http://${host}:${port}`));
