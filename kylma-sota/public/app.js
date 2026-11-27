import { nuclearScenarios, regions, roundsFor, sides } from './content.js';

const screen = document.querySelector('#screen');
const announcer = document.querySelector('#announcement');
const rules = document.querySelector('#rules');
const sessionKey = 'kylma-sota-session';
const codePattern = /^[A-HJ-NP-Z2-9]{6}$/;
const opponent = 'Parisi';
const opponentTurn = 'Parisi vuoro';
let session;
let view;
let selected = null;
let targetMode = null;
let busy = false;
let pollTimer;

document.querySelector('#rules-open').addEventListener('click', () => rules.showModal());

async function api(path, { method = 'GET', token, body } = {}) {
  const request = { method, cache: 'no-store', headers: {} };
  if (token) request.headers.Authorization = `Bearer ${token}`;
  if (body) {
    request.body = JSON.stringify(body);
    request.headers['Content-Type'] = 'application/json';
  }
  const response = await fetch(`/api/rooms${path}`, request);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(data.error || 'Palveluun ei saatu yhteyttä. Yritä uudelleen.'), { status: response.status });
  }
  return data;
}

function showError(message) {
  const target = screen.querySelector('.error');
  if (target) target.textContent = message;
}

function announce(message) {
  announcer.textContent = message;
}

function lobby(message = '') {
  screen.innerHTML = `
    <section class="lobby">
      <h1>Kylmä sota</h1>
      <p class="intro">Kilpaile vaikutusvallasta ja pidä jännite hallinnassa. Pelaa pariasi vastaan omalta koneeltasi.</p>
      <div class="entry-grid">
        <section class="panel"><h2>Luo pelihuone</h2><p>Saat huonekoodin, jonka voit kertoa parillesi.</p>
          <button class="primary" id="create">Luo peli</button>
        </section>
        <section class="panel"><h2>Liity pelihuoneeseen</h2><p>Pyydä huonekoodi pariltasi.</p>
          <form id="join"><label for="room-code">Huonekoodi</label><div class="form-row">
            <input id="room-code" name="code" required minlength="6" maxlength="6" spellcheck="false" autocomplete="off">
            <button>Liity peliin</button></div>
          </form>
        </section>
      </div>
      <p class="error" role="status"></p>
    </section>`;
  showError(message);
  screen.querySelector('#create').addEventListener('click', () => begin(''));
  screen.querySelector('#join').addEventListener('submit', event => {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get('code').trim().toUpperCase();
    if (!codePattern.test(code)) {
      showError('Tarkista, että huonekoodissa on kuusi merkkiä.');
      return;
    }
    begin(`/${code}/join`);
  });
}

async function begin(path) {
  if (busy) return;
  busy = true;
  showError('');
  screen.querySelectorAll('button').forEach(button => { button.disabled = true; });
  try {
    const { token, ...state } = await api(path, { method: 'POST' });
    session = { token, code: state.code };
    try { sessionStorage.setItem(sessionKey, JSON.stringify(session)); } catch {}
    showState(state);
    schedulePoll();
  } catch (error) {
    showError(error.status ? error.message : 'Palveluun ei saatu yhteyttä. Yritä uudelleen.');
    screen.querySelectorAll('button').forEach(button => { button.disabled = false; });
  } finally {
    busy = false;
  }
}

function leave(message) {
  clearTimeout(pollTimer);
  session = undefined;
  view = undefined;
  try { sessionStorage.removeItem(sessionKey); } catch {}
  lobby(message);
}

function waiting() {
  screen.innerHTML = `
    <section class="lobby"><div class="panel">
      <h1>Odotetaan paria</h1>
      <p class="code">${view.code}</p>
      <p>Kerro koodi parillesi. Hän voi liittyä samalta aloitussivulta.</p>
      <p>Pelaat <strong class="faction us">Yhdysvaltoina</strong>.</p>
      <button id="leave" class="quiet">Palaa aloitukseen</button>
      <p class="error" role="status"></p>
    </div></section>`;
  screen.querySelector('#leave').addEventListener('click', () => leave());
}

function mapRegions() {
  return regions.filter(({ id }) => Object.hasOwn(view.influence, id));
}

const mapControlLabels = {
  us: 'Yhdysvallat johtaa',
  su: 'Neuvostoliitto johtaa',
  tied: 'Tasan',
  locked: 'Avautuu myöhemmin',
};

function areaLeader(id) {
  const { us, su } = view.influence[id];
  if (us === su) return 'tied';
  return us > su ? 'us' : 'su';
}

function mapTable() {
  return `<table class="influence">
    <caption class="sr-only">Vaikutusvalta alueittain</caption>
    <thead><tr><th scope="col">Alue</th><th scope="col" class="faction us">Yhdysvallat</th><th scope="col" class="faction su">Neuvostoliitto</th></tr></thead>
    <tbody>${mapRegions().map(({ name, id }, index) => {
      const { us, su } = view.influence[id];
      const leader = areaLeader(id);
      return `<tr><th scope="row">${name}</th>${index <= view.round
        ? `<td class="faction us ${leader === 'us' ? 'lead' : ''}">${us}</td><td class="faction su ${leader === 'su' ? 'lead' : ''}">${su}</td>`
        : '<td colspan="2" class="muted">Avautuu myöhemmin</td>'}</tr>`;
    }).join('')}</tbody>
  </table>`;
}

function signed(number) {
  return number > 0 ? `+${number}` : String(number).replace('-', '−');
}

function canPlay(state) {
  return state.opening ? !state.openingReady : state.side === state.turn;
}

function turnPrompt() {
  if (view.opening && view.openingReady) {
    return ['Avaussiirtosi on lukittu', `Odota, että ${opponent.toLowerCase()} tekee valintansa.`];
  }
  if (!canPlay(view)) return [opponentTurn, 'Voit tutustua kortteihisi odottaessasi.'];

  let instruction = 'Valitse yksi kortti.';
  if (targetMode === 'influence') instruction = 'Valitse alue, jolla haluat lisätä vaikutusvaltaa.';
  else if (targetMode === 'pressure') instruction = 'Valitse alue, jolla haluat painostaa vastustajaa.';
  else if (selected !== null) instruction = 'Valitse, miten käytät kortin.';
  return [view.opening ? 'Tee avaussiirtosi' : 'Sinun vuorosi', instruction];
}

function announceTurn() {
  announcer.textContent = turnPrompt().join('. ');
}

function lastMoveFeedback() {
  const move = view.log.findLast(({ side }) => side === view.side);
  if (!move) return '';
  const [summary] = move.effect.split(/(?<=\.)\s/, 1);
  return `<p class="turn-feedback"><strong>Viimeisin siirtosi</strong> · ${summary}${move.change ? ` Jännite ${signed(move.change)}.` : ''}</p>`;
}

function eventBeneficiary(card) {
  if (card.scoring) return 'Piste alueella johtavalle';
  if (card.owner === 'us') return 'Tapahtuma hyödyttää Yhdysvaltoja';
  if (card.owner === 'su') return 'Tapahtuma hyödyttää Neuvostoliittoa';
  return 'Vaikutusvalta tapahtuman pelaajalle';
}

function playScreen() {
  const timeline = roundsFor(view.ruleset);
  const round = timeline[view.round];
  const ownTurn = canPlay(view);
  const advanced = view.ruleset === 3;
  const recentMoves = advanced ? view.log.filter(move => move.round === view.round) : view.log.slice(-1);
  const [heading, instruction] = turnPrompt();
  screen.innerHTML = `
    <div class="topline"><p>Kriisi ${view.round + 1}/${timeline.length} · ${round.years}</p>
      <p>Huone <b>${view.code}</b> · Pelaat <strong class="faction ${view.side}">${view.side === 'us' ? 'Yhdysvaltoina' : 'Neuvostoliittona'}</strong></p></div>
    <section class="turn-banner ${ownTurn ? 'your-turn' : ''}" aria-labelledby="turn-heading">
      <h2 id="turn-heading" tabindex="-1">${heading}</h2>
      <p id="turn-instruction">${instruction}</p>
      ${lastMoveFeedback()}
    </section>
    <div class="game-grid">
      <section class="panel actions" aria-label="Omat kortit ja siirrot">
        ${view.opening && ownTurn ? `<p class="opening-tip">${opponent} voi valita samaan aikaan. Avaussiirrot paljastuvat, kun molemmat ovat valinneet.</p>` : ''}
        <div class="card-grid">${view.hand.map((card, index) => `
          <button class="card" data-card="${index}" aria-pressed="false" ${ownTurn ? '' : 'disabled'}>
            <strong>${card.title}</strong>
            ${advanced ? `<span class="card-beneficiary faction ${card.owner ?? ''}">${eventBeneficiary(card)}${card.owner && card.owner !== view.side ? ' · vastustajan tapahtuma' : ''}</span>` : ''}
            <span>${card.effect}</span>
            ${advanced ? `<span class="delta">${card.ops} ${card.ops === 1 ? 'toimintapiste' : 'toimintapistettä'} · ${regions.find(({ id }) => id === card.region).name}</span>` : ''}
            ${card.scoring ? '' : `<span class="delta">Tapahtuma · vaikutusvalta +${card.points} · jännite ${signed(card.tension)}</span>`}
          </button>`).join('')}</div>
        ${ownTurn ? '<div id="move-options"></div>' : ''}
        <p class="error" role="status"></p>
        ${recentMoves.map(move => `<p class="latest muted"><strong>${sides[move.side]} · ${move.title} · ${move.target}</strong><br>${move.effect}</p>`).join('')}
      </section>
      <section class="panel crisis"><h1>${round.title}</h1><p>${round.intro}</p>
        <div class="map" aria-hidden="true"><canvas width="720" height="342"></canvas></div>
        <ul class="map-key" role="list" aria-label="Kartan selite">
          ${Object.entries(mapControlLabels).map(([control, label]) => `<li data-control="${control}">${label}</li>`).join('')}
        </ul>
        ${mapTable()}
        ${advanced ? `<p class="muted">Avaruuskilvan askeleet · Yhdysvallat ${view.space.us} · Neuvostoliitto ${view.space.su}</p>` : ''}
        <div class="jannite"><h2>Jännite <b>${view.tension}/6</b></h2>
          <div class="meter" aria-hidden="true">${Array.from({ length: 6 }, (_, index) => `<span class="${index < view.tension ? `active ${view.tension >= 5 ? 'danger' : ''}` : ''}"></span>`).join('')}</div>
          <p>${view.tension >= 5 ? 'Ydinsodan vaara on suuri. Jännitettä voi vielä laskea.' : 'Jos jännite jää tasolle 6/6 kierroksen lopussa, syttyy ydinsota ja molemmat häviävät.'}</p>
        </div>
      </section>
    </div>`;
  drawMap(round.region);
  if (ownTurn) {
    screen.querySelectorAll('[data-card]').forEach(card => card.addEventListener('click', () => selectCard(Number(card.dataset.card))));
  }
}

function drawMap(activeRegion) {
  const frame = screen.querySelector('.map');
  const canvas = frame.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const x = longitude => (longitude + 180) * 2;
  const y = latitude => (83 - latitude) * 2.45;
  const coasts = [
    [[-169,65],[-140,70],[-118,73],[-96,76],[-62,68],[-55,54],[-66,46],[-78,34],[-80,25],[-92,29],[-97,18],[-83,10],[-79,8],[-89,13],[-102,20],[-118,33],[-125,48],[-140,59],[-161,56]],
    [[-78,9],[-63,12],[-49,2],[-35,-7],[-42,-23],[-57,-35],[-69,-54],[-74,-40],[-77,-22],[-81,-4]],
    [[-58,59],[-74,72],[-53,83],[-30,80],[-20,68],[-43,60]],
    [[-10,36],[-9,44],[1,51],[9,54],[14,69],[28,71],[41,67],[66,72],[87,73],[110,72],[141,72],[166,66],[178,66],[160,60],[145,51],[134,47],[131,34],[121,24],[108,18],[104,3],[98,7],[89,21],[81,8],[75,8],[67,25],[59,26],[52,16],[43,13],[37,29],[30,40],[18,44],[9,39],[3,43],[-3,36]],
    [[-16,34],[2,37],[20,32],[32,31],[44,13],[51,10],[43,0],[38,-16],[29,-31],[18,-35],[11,-20],[7,1],[-9,5],[-17,15]],
    [[113,-23],[120,-16],[138,-13],[153,-25],[147,-39],[130,-33],[116,-35]],
    [[130,33],[137,36],[143,44],[142,38],[135,33]],
    [[-84,23],[-74,21],[-75,19],[-82,21]],
  ];
  if (ctx) {
    ctx.strokeStyle = '#345053';
    for (let longitude = -150; longitude < 180; longitude += 30) {
      ctx.beginPath(); ctx.moveTo(x(longitude), 0); ctx.lineTo(x(longitude), 342); ctx.stroke();
    }
    for (let latitude = -45; latitude <= 75; latitude += 15) {
      ctx.beginPath(); ctx.moveTo(0, y(latitude)); ctx.lineTo(720, y(latitude)); ctx.stroke();
    }
    ctx.fillStyle = '#527574';
    ctx.strokeStyle = '#79958d';
    for (const coast of coasts) {
      ctx.beginPath();
      coast.forEach(([longitude, latitude], index) => index ? ctx.lineTo(x(longitude), y(latitude)) : ctx.moveTo(x(longitude), y(latitude)));
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  }
  const locations = {
    berlin: [13, 52, 'northwest'], korea: [127, 38, 'north'], hungary: [19, 47, 'southwest'],
    cuba: [-79, 22, 'south'], vietnam: [108, 16, 'south'], afghanistan: [69, 34, 'south'],
  };
  mapRegions().forEach(({ id, name }, index) => {
    const [longitude, latitude, labelPosition] = locations[id];
    const control = index <= view.round ? areaLeader(id) : 'locked';
    const marker = document.createElement('span');
    marker.className = `map-marker ${labelPosition}${id === activeRegion ? ' current' : ''}`;
    marker.dataset.region = id;
    marker.dataset.control = control;
    marker.style.left = `${100 * x(longitude) / 720}%`;
    marker.style.top = `${100 * y(latitude) / 342}%`;
    marker.title = `${name} · ${mapControlLabels[control]}`;

    const dot = document.createElement('span');
    dot.className = 'map-dot';
    const label = document.createElement('span');
    label.className = 'map-label';
    label.textContent = name;
    marker.append(dot, label);
    frame.append(marker);
  });
}

function selectCard(index) {
  if (busy) return;
  const previous = selected;
  selected = index;
  screen.querySelectorAll('[data-card]').forEach(button => {
    const active = Number(button.dataset.card) === index;
    button.hidden = index !== null && !active;
    button.setAttribute('aria-pressed', active);
  });
  selectMode(null);
  if (index === null) screen.querySelector(`[data-card="${previous}"]`)?.focus();
}

function selectMode(mode) {
  const previousMode = targetMode;
  targetMode = mode;
  screen.querySelector('#turn-instruction').textContent = turnPrompt()[1];
  announceTurn();
  const options = screen.querySelector('#move-options');
  if (selected === null) {
    options.replaceChildren();
    return;
  }

  const card = view.hand[selected];
  const advanced = view.ruleset === 3;
  const opposingEvent = card.owner && card.owner !== view.side;
  const influence = `Lisää ${advanced ? card.ops : 2} vaikutusvaltaa`;
  const event = card.scoring ? 'Pisteytä kortin alue' : opposingEvent ? 'Pelaa vastustajan tapahtuma' : 'Pelaa tapahtuma';
  if (mode) {
    const currentRegion = roundsFor(view.ruleset)[view.round].region;
    options.innerHTML = `<div class="controls">
      <div><label for="target">Kohdealue</label><select id="target">
        ${mapRegions().slice(0, view.round + 1).map(({ id, name }) => `<option value="${id}" ${id === currentRegion ? 'selected' : ''}>${name}</option>`).join('')}
      </select></div>
      <button id="confirm-target" class="primary">${mode === 'influence' ? influence : 'Painosta valitulla alueella'}</button>
    </div>
    ${opposingEvent ? `<p class="card-note muted">${eventBeneficiary(card)} myös tässä siirrossa.</p>` : ''}
    <button id="change-mode" class="quiet change-choice">Vaihda käyttötapaa</button>`;
    options.querySelector('#confirm-target').addEventListener('click', () => play(mode, options.querySelector('#target').value));
    options.querySelector('#change-mode').addEventListener('click', () => selectMode(null));
    options.querySelector('#target').focus();
    return;
  }

  options.innerHTML = `<div class="controls">
    <button id="event">${event}</button>
    <button id="influence">${influence}</button>
    ${advanced ? '<button id="pressure">Painosta</button><button id="space">Avaruuskilpa</button>' : ''}
  </div>
  ${advanced ? `<p class="card-note muted">${opposingEvent
    ? `${eventBeneficiary(card)} myös silloin, kun lisäät vaikutusvaltaa tai painostat. Avaruuskilvassa tapahtuma jää toteutumatta.`
    : 'Painostus vähentää vastustajan vaikutusvaltaa ja nostaa jännitettä. Avaruuskilpa tuo yhden pisteen joka toisesta askeleesta.'}</p>` : ''}
  <button id="change-card" class="quiet change-choice">Vaihda korttia</button>`;
  options.querySelector('#event').addEventListener('click', () => play('event'));
  options.querySelector('#influence').addEventListener('click', () => selectMode('influence'));
  options.querySelector('#pressure')?.addEventListener('click', () => selectMode('pressure'));
  options.querySelector('#space')?.addEventListener('click', () => play('space'));
  options.querySelector('#change-card').addEventListener('click', () => selectCard(null));
  options.querySelector(`#${previousMode ?? 'event'}`).focus();
}

async function play(mode, target) {
  if (!session || busy || selected === null || !canPlay(view)) return;
  busy = true;
  showError('');
  const controls = screen.querySelector('#move-options');
  const submitButton = document.activeElement;
  screen.querySelector('#turn-instruction').textContent = 'Lähetetään siirtoa…';
  controls.setAttribute('inert', '');
  screen.querySelector('.card-grid').setAttribute('inert', '');
  const active = session;
  try {
    const result = await api(`/${active.code}/turn`, {
      method: 'POST', token: active.token,
      body: { mode, target, card: selected, version: view.version, opening: view.opening },
    });
    if (active === session) showState(result, true);
  } catch (error) {
    if (active === session) showError(error.status ? error.message : 'Yhteys katkesi. Tarkistetaan pelin tilanne.');
  } finally {
    busy = false;
    if (controls.isConnected) {
      controls.removeAttribute('inert');
      screen.querySelector('.card-grid').removeAttribute('inert');
      screen.querySelector('#turn-instruction').textContent = turnPrompt()[1];
      if (document.activeElement === document.body) submitButton?.focus({ preventScroll: true });
    }
  }
}

function nuclearEnding(round) {
  const scenario = nuclearScenarios[round.region];
  return `<section class="panel nuclear-ending" aria-labelledby="nuclear-title">
    <h2 id="nuclear-title">Jos täysimittainen ydinsota olisi syttynyt</h2>
    ${scenario ? `<p class="nuclear-toll">${scenario.toll}</p><p>${scenario.explanation}</p>` : ''}
    <p>Räjähdykset, palot ja radioaktiivinen laskeuma olisivat tappaneet ja loukanneet ihmisiä. Pahiten tuhoutuneilla alueilla sairaalat, sähkönjakelu ja vesihuolto olisivat voineet lakata toimimasta.</p>
    <h3>Mitä ihmissivilisaatiolle olisi voinut tapahtua?</h3>
    <p>Jos suurpaloista olisi noussut paljon nokea ilmakehään, ilmasto olisi voinut viiletä ja sadot pienentyä myös kaukana sota-alueelta. Se olisi voinut aiheuttaa nälänhätää maissa, jotka eivät osallistuneet sotaan. Pahiten kärsineillä alueilla yhteiskunnat olisivat voineet hajota. Osa yhteiskunnista olisi voinut selvitä. Toipuminen olisi riippunut tuhon laajuudesta ja siitä, miten ruokaa, vettä ja hoitoa olisi saatu järjestettyä.</p>
    <p class="sources">${scenario ? `<a href="${scenario.source[1]}" target="_blank" rel="noopener noreferrer">${scenario.source[0]}</a>` : ''}
      <a href="https://digital.library.unt.edu/ark:/67531/metadc39401/" target="_blank" rel="noopener noreferrer">Yhdysvaltain kongressin arvio ydinsodan seurauksista</a>
      <a href="https://doi.org/10.1038/s43016-022-00573-0" target="_blank" rel="noopener noreferrer">Nature Food: ydinsota ja maailman ruokaturva</a></p>
  </section>`;
}

function militaryDeathsTable(rows) {
  return `<table class="military-deaths">
    <thead><tr><th scope="col">Osapuoli</th><th scope="col">Kuolleita sotilaita</th></tr></thead>
    <tbody>${rows.map(([side, deaths]) => `<tr><th scope="row">${side}</th><td>${deaths}</td></tr>`).join('')}</tbody>
  </table>`;
}

const gameEndings = {
  us: {
    title: 'Yhdysvallat voitti',
    effect: 'Pelin maailmassa Neuvostoliitto romahtaa ja Yhdysvallat jää maailman ainoaksi supervallaksi.',
    history: 'Historiassa Neuvostoliitto hajosi vuonna 1991.',
  },
  tie: {
    title: 'Tasapeli',
    effect: 'Pelin maailmassa Neuvostoliitto säilyy. Suurvallat ovat tasaväkisiä, ja niiden kilpailu jatkuu.',
  },
  su: {
    title: 'Neuvostoliitto voitti',
    effect: 'Pelin maailmassa kommunismin vaikutus laajenee. Yhdysvallat säilyy suurvaltana.',
  },
  nuclear: {
    title: 'Molemmat hävisivät',
    effect: 'Jännite oli kriisin lopussa tasolla 6/6. Pelin maailmassa Yhdysvaltojen ja Neuvostoliiton välille syttyi täysimittainen ydinsota.',
  },
};

function endScreen() {
  const { us, su } = view.scores;
  const timeline = roundsFor(view.ruleset);
  const scoreResult = us === su ? 'tie' : us > su ? 'us' : 'su';
  const outcome = view.phase === 'escalated' ? 'nuclear' : scoreResult;
  const result = gameEndings[outcome];
  screen.innerHTML = `
    <section class="ending">
      <header class="panel ending-outcome" data-outcome="${outcome}">
        <h1>${result.title}</h1>
        <p class="ending-effect">${result.effect}</p>
        ${result.history ? `<p class="ending-history muted">${result.history}</p>` : ''}
        <p class="ending-scores"><strong>${outcome === 'nuclear' ? 'Pisteet sodan syttyessä' : 'Loppupisteet'}</strong>
          <span class="faction us">Yhdysvallat ${us} p.</span> <span class="faction su">Neuvostoliitto ${su} p.</span></p>
        ${view.bonus ? `<p class="ending-bonus muted">Pisteytyskorteista ja avaruuskilvasta · Yhdysvallat ${view.bonus.us} p. · Neuvostoliitto ${view.bonus.su} p.</p>` : ''}
        ${lastMoveFeedback()}
      </header>
      ${outcome === 'nuclear' ? nuclearEnding(timeline[view.round]) : ''}
      <h2>Mitä ihmisille tapahtui?</h2>
      <p class="muted">Jokaisessa kriisissä näkyvät pelinne päätökset ja historialliset tiedot kuolleista. Luvuissa voi olla eri rajauksia.</p>
      <div class="results">${timeline.map((round, index) => {
        const moves = view.log.filter(move => move.round === index);
        return `<article class="panel"><p class="muted">${round.years}</p><h2>${round.title}</h2>
          <p class="toll">${round.toll}</p><p class="scope muted">${round.scope}</p>
          <h3>Sotilaskuolemat</h3>${militaryDeathsTable(round.militaryDeaths)}
          <p class="scope muted">${round.militaryNote}</p>
          ${round.otherMilitaryDeaths ? `<details class="military-more"><summary>${round.otherMilitaryLabel ?? 'Muut YK-operaatioon osallistuneet maat'} (${round.otherMilitaryDeaths.length})</summary>${militaryDeathsTable(round.otherMilitaryDeaths)}</details>` : ''}
          <h3>Historiassa</h3><p>${round.history}</p><p>${round.human}</p>
          <h3>Teidän pelissänne</h3>${moves.length ? `<ul>${moves.map(move => `<li><strong>${sides[move.side]} · ${move.title}</strong><br>${move.effect}</li>`).join('')}</ul>` : '<p>Peli päättyi ennen tätä kierrosta.</p>'}
          <p class="sources">${round.sources.map(([source, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${source}</a>`).join('')}</p>
        </article>`;
      }).join('')}</div>
      <div class="panel"><h2>Keskustele parisi kanssa</h2><ol>
        <li>Miten hankitte vaikutusvaltaa? Miksi suurvallat pyrkivät välttämään suoraa sotaa keskenään?</li>
        <li>Valitse yksi kriisi. Kerro, miten suurvaltojen päätökset vaikuttivat tavallisiin ihmisiin. Mitä alueen omat asukkaat tai hallitus pystyivät tekemään?</li>
      </ol></div>
      <button id="leave" class="quiet">Palaa aloitukseen</button>
    </section>`;
  screen.querySelector('#leave').addEventListener('click', () => leave());
}

function showState(next, submitted = false) {
  if (view && next.version <= view.version) return;
  // The other player's secret choice changes the version but leaves this player's controls intact.
  if (view?.opening && next.opening && view.round === next.round && !view.openingReady && !next.openingReady) {
    view = next;
    return;
  }
  view = next;
  selected = null;
  targetMode = null;
  if (next.phase === 'waiting') {
    waiting();
    announce('Pelihuone luotu. Odotetaan paria.');
  } else if (next.phase === 'playing') {
    playScreen();
    announceTurn();
    if (submitted) screen.querySelector('#turn-heading').focus({ preventScroll: true });
  } else {
    endScreen();
    screen.querySelector('h1').tabIndex = -1;
    screen.querySelector('h1').focus();
    announce('Peli päättyi. Voit lukea kriisien seuraukset.');
  }
}

function schedulePoll(delay = 3000) {
  clearTimeout(pollTimer);
  if (session && (!view || view.phase === 'waiting' || view.phase === 'playing')) pollTimer = setTimeout(poll, delay);
}

async function poll() {
  const active = session;
  if (!active) return;
  try {
    const next = await api(`/${active.code}/state`, { token: active.token });
    if (active === session) {
      const error = screen.querySelector('.error');
      if (error?.dataset.connection) {
        error.textContent = '';
        delete error.dataset.connection;
      }
      showState(next);
    }
  } catch (error) {
    if (active !== session) return;
    if (error.status === 401 || error.status === 404) {
      leave(error.message);
      return;
    }
    showError('Yhteys katkesi. Yritetään uudelleen.');
    const pendingError = screen.querySelector('.error');
    if (pendingError) pendingError.dataset.connection = 'true';
  }
  if (active === session) schedulePoll();
}

try { session = JSON.parse(sessionStorage.getItem(sessionKey)); } catch {}
if (session?.token && codePattern.test(session.code)) {
  screen.innerHTML = '<p>Palataan peliin…</p><p class="error" role="status"></p>';
  schedulePoll(0);
} else {
  session = undefined;
  lobby();
}
