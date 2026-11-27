import { regions, rounds, roundsFor, sides } from '../public/content.js';
import { hands, shuffledPacket } from './cards.js';

export const roomLifetime = 12 * 60 * 60 * 1000;
export const maxTension = 6;

export class GameError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function newRoom(code, token) {
  const room = {
    code,
    ruleset: 3,
    players: { us: token },
    expires: Date.now() + roomLifetime,
    version: 0,
    phase: 'waiting',
    round: 0,
    turn: rounds[0].first,
    tension: 1,
    influence: Object.fromEntries(regions.map(({ id }) => [id, { us: 0, su: 0 }])),
    log: [],
    packets: rounds.map(shuffledPacket),
    privateHands: { us: [], su: [] },
    queued: {},
    step: 0,
    space: { us: 0, su: 0 },
    bonus: { us: 0, su: 0 },
  };
  dealPacket(room, 3);
  return room;
}

function dealPacket(room, drawsPerSide) {
  const packet = room.packets[room.round];
  for (const side of ['us', 'su']) room.privateHands[side].push(...packet.splice(0, drawsPerSide));
  packet.length = 0;
}

export function getSide(room, token) {
  const side = Object.keys(room.players).find(key => room.players[key] === token);
  if (!side) throw new GameError('Pelaajan istuntoa ei löytynyt. Palaa aloitukseen.', 401);
  return side;
}

export function roomView(room, token) {
  const { players, privateHands, packets, queued, ...view } = room;
  const side = getSide(room, token);
  const round = roundsFor(room.ruleset)[room.round];
  const hand = room.phase === 'playing' ? (privateHands?.[side] ?? hands[round.region][side]) : [];
  return { ...view, side, hand, scores: scores(room.influence, room.bonus), opening: room.phase === 'playing' && room.ruleset === 3 && room.step === 0,
    openingReady: Boolean(queued?.[side]) };
}

function scores(influence, bonus) {
  const result = { us: bonus?.us ?? 0, su: bonus?.su ?? 0 };
  for (const { us, su } of Object.values(influence)) {
    if (us > su) result.us += 1;
    if (su > us) result.su += 1;
  }
  return result;
}

export function takeTurn(room, token, move) {
  const side = getSide(room, token);
  if (room.ruleset === 3) return takeHandTurn(room, side, move);
  if (room.phase !== 'playing' || room.turn !== side || room.version !== move.version) {
    throw new GameError('Pelivuoro ehti vaihtua. Päivitetään tilanne.', 409);
  }

  const timeline = roundsFor(room.ruleset);
  const round = timeline[room.round];
  const cards = hands[round.region][side];
  if (!Number.isInteger(move.card) || move.card < 0 || move.card >= cards.length) {
    throw new GameError('Valitse ensin kortti.');
  }
  if (move.mode !== 'event' && move.mode !== 'influence') {
    throw new GameError('Valitse, miten käytät kortin.');
  }

  const card = cards[move.card];
  const event = move.mode === 'event';
  const target = regions.find(({ id }) => id === (event ? round.region : move.target));
  if (!target || !timeline.slice(0, room.round + 1).some(({ region }) => region === target.id)) {
    throw new GameError('Valitse kartalta käytössä oleva alue.');
  }
  const points = event ? card.points : 2;
  const before = room.tension;
  room.tension = Math.max(0, Math.min(maxTension, room.tension + (event ? card.tension : 0)));
  room.influence[target.id][side] += points;
  room.version += 1;
  room.log.push({
    round: room.round,
    side,
    title: event ? card.title : 'Vaikutusvallan lisääminen',
    target: target.name,
    points,
    change: room.tension - before,
    effect: event ? card.effect : `${sides[side]} vahvistaa suhteitaan alueella. Suurvaltojen välinen jännite säilyy ennallaan.`,
  });

  if (side === round.first) {
    room.turn = side === 'us' ? 'su' : 'us';
    return;
  }
  advanceCrisis(room, timeline);
}

function advanceCrisis(room, timeline) {
  if (room.tension >= maxTension || room.round === timeline.length - 1) {
    room.phase = room.tension >= maxTension ? 'escalated' : 'finished';
    return;
  }
  room.round += 1;
  room.turn = timeline[room.round].first;
  const crisisCeiling = room.ruleset === 3 ? maxTension - 1 : maxTension;
  room.tension = Math.min(crisisCeiling, room.tension + timeline[room.round].tension);
}

function otherSide(side) {
  return side === 'us' ? 'su' : 'us';
}

function takeHandTurn(room, side, move) {
  const opening = room.step === 0;
  const rival = otherSide(side);
  const concurrentOpening = opening && room.queued[rival] && move.version === room.version - 1;
  if (room.phase !== 'playing' || move.opening !== opening || (move.version !== room.version && !concurrentOpening)
    || (opening ? room.queued[side] : room.turn !== side)) {
    throw new GameError('Pelivuoro ehti vaihtua. Päivitetään tilanne.', 409);
  }
  if (!Number.isInteger(move.card) || !room.privateHands[side][move.card]) throw new GameError('Valitse ensin kortti.');
  if (!['event', 'influence', 'pressure', 'space'].includes(move.mode)) throw new GameError('Valitse, miten käytät kortin.');
  if (['influence', 'pressure'].includes(move.mode) && !rounds.slice(0, room.round + 1).some(({ region }) => region === move.target)) {
    throw new GameError('Valitse kartalta käytössä oleva alue.');
  }

  room.version += 1;
  if (opening) {
    room.queued[side] = { card: move.card, mode: move.mode, target: move.target };
    if (!room.queued[rival]) return;
    const first = rounds[room.round].first;
    for (const faction of [first, otherSide(first)]) resolveHandMove(room, faction, room.queued[faction]);
    room.queued = {};
    room.step = 2;
    room.turn = first;
    return;
  }

  resolveHandMove(room, side, move);
  room.step += 1;
  room.turn = rival;
  if (room.step === 4) {
    advanceCrisis(room, rounds);
    if (room.phase === 'playing') {
      room.step = 0;
      dealPacket(room, 2);
    }
  }
}

function resolveHandMove(room, side, move) {
  const [card] = room.privateHands[side].splice(move.card, 1);
  const rival = otherSide(side);
  const before = room.tension;
  const effects = [];
  let title = card.title;
  let target = regions.find(({ id }) => id === card.region).name;
  if (move.mode === 'space') {
    room.space[side] += 1;
    if (room.space[side] % 2 === 0) room.bonus[side] += 1;
    title = 'Avaruuskilpa';
    target = 'Avaruus';
    effects.push(`${sides[side]} etenee yhden askeleen avaruuskilvassa.`);
  } else if (move.mode !== 'event') {
    const influence = room.influence[move.target];
    target = regions.find(({ id }) => id === move.target).name;
    if (move.mode === 'influence') {
      influence[side] += card.ops;
      title = 'Vaikutusvallan lisääminen';
      effects.push(`${target} · ${sides[side]} saa ${card.ops} vaikutusvaltaa.`);
    } else {
      const loss = Math.min(influence[rival], card.ops);
      influence[rival] -= loss;
      room.tension += 1;
      title = 'Painostus';
      effects.push(`${target} · ${sides[rival]} menettää ${loss} vaikutusvaltaa.`);
    }
  }

  if (move.mode === 'event' || (move.mode !== 'space' && card.owner === rival)) {
    effects.push(applyCardEvent(room, card, card.owner ?? side));
  }
  room.tension = Math.max(0, Math.min(maxTension, before + 1, room.tension));
  const change = room.tension - before;
  if (change) effects.push(`Jännite ${change > 0 ? '+' : '−'}${Math.abs(change)}.`);
  room.log.push({ round: room.round, side, title, target, change, effect: effects.join(' ') });
}

function applyCardEvent(room, card, owner) {
  const influence = room.influence[card.region];
  if (card.scoring) {
    if (influence.us === influence.su) return 'Alueen pisteytys päättyi tasan.';
    const leader = influence.us > influence.su ? 'us' : 'su';
    room.bonus[leader] += 1;
    return `${sides[leader]} saa pisteen alueen pisteytyksestä.`;
  }
  room.tension += card.tension;
  influence[owner] += card.points;
  return `${card.title} (${sides[owner]}) toteutuu. ${card.effect}`;
}
