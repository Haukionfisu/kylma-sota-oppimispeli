import { GameError, newRoom, roomView, takeTurn } from './game.js';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const codePattern = /^[A-HJ-NP-Z2-9]{6}$/;

function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function roomRequest(request, storage, code) {
  try {
    const action = new URL(request.url).pathname.split('/').at(-1);
    const token = request.headers.get('Authorization')?.match(/^Bearer ([a-f0-9-]{36})$/i)?.[1];
    let move;
    if (action === 'turn') {
      const raw = await request.text();
      if (raw.length > 512) throw new GameError('Siirron tiedot ovat liian pitkät.');
      try { move = JSON.parse(raw); } catch { throw new GameError('Siirtoa ei tunnistettu.'); }
      if (!move || typeof move !== 'object') throw new GameError('Siirtoa ei tunnistettu.');
    }
    if (action === 'state') {
      const room = await storage.get('room');
      if (!room || room.expires <= Date.now()) throw new GameError('Pelihuonetta ei löytynyt tai se on vanhentunut.', 404);
      return json(roomView(room, token));
    }

    const result = await storage.transaction(async tx => {
      const room = await tx.get('room');
      if (action === 'create') {
        if (room) throw new GameError('Koodi on käytössä.', 409);
        const newToken = crypto.randomUUID();
        const created = newRoom(code, newToken);
        await tx.put('room', created);
        return { view: roomView(created, newToken), token: newToken, created: created.expires };
      }
      if (!room || room.expires <= Date.now()) throw new GameError('Pelihuonetta ei löytynyt tai se on vanhentunut.', 404);
      if (action === 'join') {
        if (room.players.su) throw new GameError('Huoneessa on jo kaksi pelaajaa.', 409);
        const guestToken = crypto.randomUUID();
        room.players.su = guestToken;
        room.phase = 'playing';
        room.version += 1;
        await tx.put('room', room);
        return { view: roomView(room, guestToken), token: guestToken };
      }
      takeTurn(room, token, move);
      await tx.put('room', room);
      return { view: roomView(room, token) };
    });
    if (result.created) await storage.setAlarm(result.created);
    return json({ ...result.view, ...(result.token && { token: result.token }) });
  } catch (error) {
    if (error instanceof GameError) return json({ error: error.message }, error.status);
    throw error;
  }
}

export async function routeApi(request, roomFor) {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/api\/rooms\/([^/]+)\/(join|state|turn)$/);

  if (request.method === 'POST' && url.pathname === '/api/rooms') {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), byte => alphabet[byte % 32]).join('');
      const result = await roomFor(code, new Request(new URL(`/internal/${code}/create`, url), { method: 'POST' }));
      if (result.status !== 409) return result;
    }
    return json({ error: 'Huoneen luominen epäonnistui. Yritä uudelleen.' }, 503);
  }
  if (match && codePattern.test(match[1]) && request.method === (match[2] === 'state' ? 'GET' : 'POST')) {
    return roomFor(match[1], request);
  }
  return json({ error: 'Osoitetta ei löytynyt. Tarkista huonekoodi.' }, 404);
}
