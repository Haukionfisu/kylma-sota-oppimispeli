const screen = document.querySelector('#screen');
const announcer = document.querySelector('#announcement');
const rules = document.querySelector('#rules');
const playerToken = 'human';
const botToken = 'computer';
const busy = false;
let game;
let view;
let selected = null;
let botTimer;

document.querySelector('#rules-open').addEventListener('click', () => rules.showModal());
document.querySelector('.brand').addEventListener('click', event => {
  event.preventDefault();
  if (!game || game.phase !== 'playing' || confirm('Palataanko aloitukseen? Käynnissä oleva peli päättyy.')) leave();
});

function leave() {
  clearTimeout(botTimer);
  game = undefined;
  screen.innerHTML = `
    <section class="lobby solo-lobby"><h1>Kylmä sota</h1>
      <p class="intro">Pelaat Yhdysvaltoina ja tietokone Neuvostoliittona. Kilpaile vaikutusvallasta ja pidä suurvaltojen välinen jännite hallinnassa.</p>
      <p class="muted">${rounds.length} kriisiä · noin 15–30 minuuttia</p>
      <button class="primary" id="start">Aloita peli</button>
    </section>`;
  screen.querySelector('#start').addEventListener('click', start);
}

function start() {
  game = newRoom('solo', playerToken);
  game.players.su = botToken;
  game.phase = 'playing';
  refresh(true);
}

function refresh(focusHeading = false) {
  clearTimeout(botTimer);
  selected = null;
  view = roomView(game, playerToken);
  if (view.phase === 'playing') {
    playScreen();
    announcer.textContent = `${rounds[view.round].title}. ${view.opening ? 'Salainen avaus.' : canPlay(view) ? 'Sinun vuorosi.' : 'Tietokoneen vuoro.'}`;
    if (view.opening ? !game.queued.su : view.turn === 'su') botTimer = setTimeout(botTurn, 600);
  } else {
    endScreen();
    focusHeading = true;
    announcer.textContent = 'Peli päättyi. Voit lukea kriisien seuraukset.';
  }
  if (focusHeading) {
    const heading = screen.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  } else if (canPlay(view)) {
    screen.querySelector('[data-card]')?.focus({ preventScroll: true });
  }
}

function play(mode) {
  if (!game || game.phase !== 'playing' || !canPlay(view) || selected === null) return;
  const before = game.round;
  takeTurn(game, playerToken, {
    card: selected, mode, target: screen.querySelector('#target').value, version: game.version, opening: view.opening,
  });
  refresh(game.round !== before);
}

function botTurn() {
  if (!game || game.phase !== 'playing') return;
  const opening = game.step === 0;
  if (opening ? game.queued.su : game.turn !== 'su') return;
  const round = rounds[game.round];
  const targets = regions.slice(0, game.round + 1).map(({ id }) => id);
  const options = game.privateHands.su.flatMap((_, card) => [
    { card, mode: 'event' }, { card, mode: 'space' },
    ...targets.map(target => ({ card, mode: 'influence', target })),
    ...targets.filter(target => game.influence[target].us > 0).map(target => ({ card, mode: 'pressure', target })),
  ]);

  let best = options[0];
  let bestValue = -Infinity;
  for (const move of options) {
    const next = structuredClone(game);
    resolveHandMove(next, 'su', move);
    const tally = scores(next.influence, next.bonus);
    const strength = Object.values(next.influence).reduce((sum, area) => sum + Math.min(4, area.su) - Math.min(4, area.us), 0);
    const tensionCost = [0, 0, 0.15, 0.5, 1.1, 2.4, 7][next.tension];
    const value = next.tension === 6 && game.step === 3 ? -100
      : (tally.su - tally.us) * 2 + strength * 0.25 + next.space.su * 0.45 - tensionCost
        + (move.target === round.region ? 0.2 : 0);
    if (value > bestValue) {
      best = move;
      bestValue = value;
    }
  }
  const before = game.round;
  takeTurn(game, botToken, { ...best, version: game.version, opening });
  refresh(game.round !== before);
}

