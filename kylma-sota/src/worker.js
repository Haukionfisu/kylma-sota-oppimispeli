import { DurableObject } from 'cloudflare:workers';
import { roomRequest, routeApi } from './api.js';

export class GameRoom extends DurableObject {
  fetch(request) {
    const code = new URL(request.url).pathname.split('/').at(-2);
    return roomRequest(request, this.ctx.storage, code);
  }

  alarm() {
    return this.ctx.storage.deleteAll();
  }
}

export default {
  fetch(request, env) {
    if (!new URL(request.url).pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    return routeApi(request, (code, roomRequest) => env.ROOMS.getByName(code).fetch(roomRequest));
  },
};
