export const hands = {
  berlin: {
    us: [
      { title: 'Ilmasilta', points: 2, tension: -1, effect: 'Länsi-Berliiniin saapuu lisää elintarvikkeita ja polttoainetta.' },
      { title: 'Aseellinen painostus', points: 3, tension: 2, effect: 'Voimannäyttö lisää yhteenoton vaaraa, ja huolto on yhä epävarmaa.' },
    ],
    su: [
      { title: 'Neuvottelutarjous', points: 1, tension: -2, effect: 'Reittien avaamisesta voidaan neuvotella. Huolto voi helpottua.' },
      { title: 'Tiukempi saarto', points: 3, tension: 2, effect: 'Ruoan ja polttoaineen saanti vaikeutuu Länsi-Berliinissä.' },
    ],
  },
  korea: {
    us: [
      { title: 'Apua pakeneville', points: 1, tension: -1, effect: 'Siviilit saavat ruokaa ja suojaa. Sota jatkuu.' },
      { title: 'Lisää sotilaallista tukea', points: 3, tension: 2, effect: 'Etelä-Korea saa lisää tukea. Taistelujen laajeneminen uhkaa siviilejä.' },
    ],
    su: [
      { title: 'Tuki aseleponeuvotteluille', points: 1, tension: -2, effect: 'Aselepoa aletaan edistää. Taistelujen loppuminen helpottaisi siviilien asemaa.' },
      { title: 'Aseapua Pohjois-Korealle', points: 3, tension: 1, effect: 'Pohjois-Korea saa tukea sodankäyntiin. Taistelut saattavat pitkittyä.' },
    ],
  },
  hungary: {
    us: [
      { title: 'Apua Unkarin pakolaisille', points: 2, tension: -1, effect: 'Rajalle saapuvat saavat ruokaa, suojaa ja mahdollisuuden jatkaa turvaan.' },
      { title: 'Poliittinen painostus', points: 3, tension: 1, effect: 'Yhdysvallat vaatii julkisesti joukkojen vetäytymistä. Kiista syvenee, eikä apu ehdi katutaisteluihin.' },
    ],
    su: [
      { title: 'Neuvottelut vetäytymisestä', points: 1, tension: -2, effect: 'Ratkaisua etsitään Unkarin hallituksen kanssa. Taistelujen päättyminen voisi helpottaa ihmisten arkea.' },
      { title: 'Kansannousun tukahduttaminen', points: 3, tension: 2, effect: 'Neuvostoliitto vahvistaa otettaan Unkarista. Katutaistelut vaarantavat asukkaat ja lisäävät pakoa maasta.' },
    ],
  },
  cuba: {
    us: [
      { title: 'Lupaus olla hyökkäämättä', points: 2, tension: -2, effect: 'Hyökkäyksen uhka Kuubassa vähenee.' },
      { title: 'Merisaarto', points: 3, tension: 2, effect: 'Yhdysvallat painostaa Neuvostoliittoa, ja merellä kasvaa yhteenoton vaara.' },
    ],
    su: [
      { title: 'Ohjusten poisvienti', points: 2, tension: -2, effect: 'Ydinaseiden käytön vaara pienenee. Kuuban turvallisuudesta täytyy yhä sopia.' },
      { title: 'Ohjukset jäävät Kuubaan', points: 3, tension: 2, effect: 'Kuuba pysyy suurvaltojen kiistan keskellä. Ydinsodan vaara kasvaa.' },
    ],
  },
  vietnam: {
    us: [
      { title: 'Tuki rauhanneuvotteluille', points: 1, tension: -2, effect: 'Vietnamin osapuolille avautuu mahdollisuus aselepoon. Siviilien turva riippuu taistelujen päättymisestä.' },
      { title: 'Sodan laajentaminen', points: 3, tension: 2, effect: 'Etelä-Vietnam saa lisää sotilaallista tukea. Taistelut pakottavat lisää perheitä jättämään kotinsa.' },
    ],
    su: [
      { title: 'Siviiliapu Pohjois-Vietnamille', points: 2, tension: -1, effect: 'Siviilit saavat lääkkeitä ja tarvikkeita, vaikka taistelut jatkuvat.' },
      { title: 'Lisää sotilaallista apua', points: 3, tension: 1, effect: 'Pohjois-Vietnamin asema vahvistuu. Ulkopuolinen tuki voi pitkittää taisteluja.' },
    ],
  },
  afghanistan: {
    us: [
      { title: 'Tuki pakolaisille', points: 1, tension: -2, effect: 'Maasta paenneet perheet saavat ruokaa, suojaa ja terveydenhuoltoa.' },
      { title: 'Aseapu vastarinnalle', points: 3, tension: 2, effect: 'Afganistanilaiset vastarintaryhmät vahvistuvat. Siviilit ovat edelleen vaarassa taistelujen jatkuessa.' },
    ],
    su: [
      { title: 'Joukkojen vetäytyminen', points: 1, tension: -2, effect: 'Neuvostoliiton osallistuminen sotaan vähenee. Afganistanin ryhmien välinen taistelu voi silti jatkua.' },
      { title: 'Sotilaallisen läsnäolon jatkaminen', points: 3, tension: 2, effect: 'Afganistanin hallitus saa lisää tukea. Sodan jatkuminen vaikeuttaa pakolaisten paluuta koteihinsa.' },
    ],
  },
};

export function shuffledPacket(round) {
  const cards = Object.entries(hands[round.region]).flatMap(([owner, events]) => events.map(card => ({
    ...card, owner, region: round.region, ops: card.tension > 0 ? 3 : 2, tension: Math.sign(card.tension),
  })));
  cards.push({ title: 'Kauppayhteistyö', owner: null, region: round.region, ops: 2, points: 2, tension: -1,
    effect: 'Kauppa vahvistaa suhteita alueella. Yhteistyö voi helpottaa tavaroiden saatavuutta.' });
  cards.push({ title: 'Alueen pisteytys', owner: null, region: round.region, ops: 1, points: 0, tension: 0, scoring: true,
    effect: 'Alueella johtava suurvalta saa heti yhden voittopisteen. Tasatilanteessa pisteitä ei jaeta.' });
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[other]] = [cards[other], cards[index]];
  }
  return cards;
}
