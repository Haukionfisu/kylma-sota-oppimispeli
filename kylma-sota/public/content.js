export const sides = { us: 'Yhdysvallat', su: 'Neuvostoliitto' };
export const regions = [
  { id: 'berlin', name: 'Berliini', area: 'Eurooppa' },
  { id: 'korea', name: 'Korea', area: 'Itä-Aasia' },
  { id: 'hungary', name: 'Unkari', area: 'Eurooppa' },
  { id: 'cuba', name: 'Kuuba', area: 'Karibia' },
  { id: 'vietnam', name: 'Vietnam', area: 'Kaakkois-Aasia' },
  { id: 'afghanistan', name: 'Afganistan', area: 'Aasia' },
];

export const rounds = [
  {
    title: 'Berliinin saarto', years: '1948–1949', region: 'berlin', first: 'su', tension: 0,
    intro: 'Toisen maailmansodan jälkeen Berliini on jaettu miehitysvyöhykkeisiin. Neuvostoliitto sulkee maareitit Länsi-Berliiniin. Kaupungin asukkaat tarvitsevat ruokaa ja polttoainetta.',
    history: 'Yhdysvallat ja Britannia kuljettivat ruokaa ja polttoainetta Länsi-Berliiniin lentokoneilla. Näin ne pitivät kaupungin huollettuna ilman aseellista läpimurtoa. Neuvostoliitto purki saarron toukokuussa 1949.',
    human: 'Saarto uhkasi yli kahden miljoonan länsiberliiniläisen arkea. Ilmasilta auttoi kaupunkia selviytymään, mutta lennot olivat vaarallisia myös siviileille, jotka työskentelivät ilmasillalla.',
    toll: 'Ilmasillalla kuoli myös siviilejä',
    scope: 'Yhdysvaltain ilmavoimien historiikki mainitsee 21 brittiläisten lentoyhtiöiden siviilityöntekijää ja yhden yhdysvaltalaisen siviilin. Eri lähteissä mainitaan lisäksi 9–12 kuollutta saksalaista.',
    militaryDeaths: [
      ['Yhdysvallat', '31'],
      ['Britannia', '16'],
      ['Australia', '1'],
      ['Etelä-Afrikka', '1'],
      ['Ranska', 'Ei eriteltyä lukua'],
      ['Neuvostoliitto', 'Ei eriteltyä lukua'],
    ],
    militaryNote: 'Luvut kuvaavat ilmasiltaoperaatiossa kuolleita sotilaita. Britannian ja Kansainyhteisön muistokirjan 39 kuolleeseen kuuluu myös siviilejä.',
    sources: [
      ['Yhdysvaltain ulkoministeriön historiatoimisto', 'https://history.state.gov/milestones/1945-1952/berlin-airlift'],
      ['Imperial War Museums: ilmasillan muistokirja', 'https://memorials.iwm.org.uk/memorial/53573'],
      ['Yhdysvaltain ilmavoimien historiikki: ilmasillan kuolonuhrit (PDF)', 'https://www.govinfo.gov/content/pkg/GOVPUB-D301-PURL-gpo128527/pdf/GOVPUB-D301-PURL-gpo128527.pdf'],
      ['AlliiertenMuseum: Berliinin ilmasilta', 'https://www.alliiertenmuseum.de/en/thema/the-berlin-airlift-1948-49/'],
    ],
  },
  {
    title: 'Korean sota', years: '1950–1953', region: 'korea', first: 'us', tension: 1,
    intro: 'Pohjois-Korea hyökkää Etelä-Koreaan. Yhdysvallat johtaa Etelä-Koreaa tukevia YK-joukkoja. Kiina liittyy sotaan Pohjois-Korean puolella, ja Neuvostoliitto tukee pohjoista.',
    history: 'Koreat kävivät sotaa omien tavoitteidensa vuoksi. Ulkopuolinen tuki laajensi sotaa. Neuvostoliitto tuki Pohjois-Koreaa muun muassa aseilla, ja neuvostolentäjien osallistuminen pidettiin salassa. Aselepo solmittiin vuonna 1953.',
    human: 'Monet joutuivat pakenemaan kodeistaan. Kun sota päättyi aselepoon ja Korea jäi jakautuneeksi, rajan eri puolille joutuneet perheet saattoivat menettää yhteyden vuosikymmeniksi.',
    toll: 'Noin 2 miljoonaa kuollutta siviiliä',
    scope: 'National Army Museumin arvio Pohjois- ja Etelä-Korean siviilikuolemista koko sodan aikana.',
    militaryDeaths: [
      ['Etelä-Korea', '137 899'],
      ['Pohjois-Korea', 'Noin 140 000'],
      ['Kiina', '197 653'],
      ['Neuvostoliitto', 'Noin 280'],
      ['Yhdysvallat', '36 574'],
      ['Britannia', '1 106'],
      ['Turkki', '900'],
    ],
    otherMilitaryDeaths: [
      ['Kanada', '516'], ['Australia', '340'], ['Ranska', '269'], ['Kolumbia', '213'],
      ['Kreikka', '194'], ['Thaimaa', '136'], ['Alankomaat', '125'], ['Etiopia', '122'],
      ['Filippiinit', '112'], ['Belgia', '106'], ['Uusi-Seelanti', '45'], ['Etelä-Afrikka', '37'],
      ['Intia', '3'], ['Norja', '3'], ['Luxemburg', '2'],
    ],
    militaryNote: 'Pohjois-Korean ja Neuvostoliiton luvut perustuvat Australian veteraanihallinnon tietoihin. Kiinan luku on maan puolustusministeriön ilmoittama. YK-maiden luvut ovat Etelä-Korean veteraaniministeriön tilastosta. Kuolleita on tilastoitu eri maissa eri tavoin.',
    sources: [
      ['National Army Museum: Korean sota', 'https://www.nam.ac.uk/explore/korean-war'],
      ['Yhdysvaltain maavoimat: Etelä-Korean sotilaskuolemat', 'https://www.army.mil/article/107980/korean_war_armistice_turns_60_july_27'],
      ['Australian veteraanihallinto: Pohjois-Korean ja Neuvostoliiton luvut', 'https://anzacportal.dva.gov.au/wars-and-missions/korean-war/politics/aftermath'],
      ['Kiinan puolustusministeriö: kuolleet kiinalaissotilaat', 'https://eng.mod.gov.cn/xb/News_213114/TopStories/4872042.html'],
      ['Etelä-Korean veteraaniministeriö: YK-maiden luvut', 'https://www.mpva.go.kr/english/contents.do?key=987'],
      ['Punaisen Ristin kansainvälinen komitea: eroon joutuneet perheet', 'https://www.icrc.org/en/article/historical-timeline-icrc-geneva-conventions-korea'],
      ['Yhdysvaltain ilmavoimien museo: neuvostolentäjät', 'https://www.nationalmuseum.af.mil/Visit/Museum-Exhibits/Fact-Sheets/Display/Article/196389/USAFmuseum/soviet-pilots-over-mig-alley/'],
    ],
  },
  {
    title: 'Unkarin kansannousu', years: '1956', region: 'hungary', first: 'us', tension: 0,
    intro: 'Unkarilaiset vaativat vapaita vaaleja ja neuvostojoukkojen poistumista. Mielenosoituksista kehittyy aseellinen kansannousu. Pääministeri Imre Nagy ilmoittaa Unkarin haluavan puolueettomaksi.',
    history: 'Neuvostoliiton joukot hyökkäsivät marraskuussa ja murskasivat kansannousun. Yhdysvallat tuomitsi hyökkäyksen, mutta ei lähettänyt joukkoja Unkariin. Neuvostoliiton tukema hallitus nousi valtaan.',
    human: 'Siviilejä joutui keskelle katutaisteluja. Noin 150 000 ihmistä oli lähtenyt Unkarista vuoden loppuun mennessä. Monet ylittivät rajan Itävaltaan ja aloittivat elämänsä uudelleen muualla.',
    toll: 'Noin 2 500 unkarilaista kuoli',
    scope: 'Arvioon kuuluu siviilejä ja taistelijoita. Pelkästään siviileistä ei ole tässä lähteessä erillistä lukua.',
    militaryDeaths: [
      ['Neuvostoliitto', '669'],
      ['Unkarin armeija', 'Arviolta 250–300'],
      ['Aseelliset kapinalliset', 'Ei eriteltyä lukua'],
    ],
    militaryNote: 'Unkarin armeijan kuolleet sisältyvät unkarilaisten kokonaislukuun. Osa unkarilaisista sotilaista taisteli kansannousun puolella.',
    sources: [
      ['YK:n Unkari-komitean raportti (PDF)', 'https://digitallibrary.un.org/record/842705/files/A_3546-EN.pdf'],
      ['UNHCR: kansannousun uhrit ja pakolaiset (PDF)', 'https://www.unhcr.org/sites/default/files/legacy-pdf/4523cb392.pdf'],
      ['Unkarin tilastokeskus: kansannousu (PDF)', 'https://www.ksh.hu/infografika/2024/1956_2024_infograf_eng.pdf'],
      ['Unkarilainen sotahistorian tutkimus: armeijan kuolleet (PDF)', 'https://www.epa.oszk.hu/00000/00018/00071/pdf/EPA00018_hadtortenelmi_2006_03_714-766.pdf'],
      ['Unkarin elektroninen kirjasto: Neuvostoliiton sotilastappiot', 'https://mek.oszk.hu/02100/02185/html/84.html'],
    ],
  },
  {
    title: 'Kuuban ohjuskriisi', years: '1962', region: 'cuba', first: 'su', tension: 2,
    intro: 'Kuuban hallitus hakee suojaa Yhdysvaltojen hyökkäystä vastaan. Neuvostoliitto sijoittaa Kuubaan ydinohjuksia. Kun Yhdysvallat saa ohjuksista tiedon, vastakkainasettelu kiristyy.',
    history: 'Neuvostoliitto suostui vetämään ohjukset pois Kuubasta. Yhdysvallat lupasi olla hyökkäämättä Kuubaan ja suostui myös poistamaan ohjuksiaan Turkista. Kuuban hallitus ei osallistunut ratkaiseviin Yhdysvaltain ja Neuvostoliiton neuvotteluihin.',
    human: 'Kuubalaiset elivät hyökkäyksen ja sodan uhan alla. Suora sota olisi voinut johtaa ydinaseiden käyttöön. Suurvaltojen sopimus vähensi vaaraa nopeasti.',
    toll: 'Rudolf Andersonin kone ammuttiin alas',
    scope: 'Anderson kuoli tiedustelulennolla Kuuban yllä. Lokakuun kriisiin liittyi myös kuolemaan johtaneita lento-onnettomuuksia.',
    militaryDeaths: [
      ['Yhdysvallat', 'Vähintään 12'],
      ['Neuvostoliitto', 'Ei eriteltyä lukua'],
      ['Kuuba', 'Ei eriteltyä lukua'],
    ],
    militaryNote: 'Yhdysvaltojen luvussa on mukana Anderson ja 11 sotilasta, jotka kuolivat lento-onnettomuuksissa Guantánamossa ja Bermudalla. Venäjän puolustusministeriö ilmoitti 64 neuvostokansalaisen kuolleen Kuubassa vuosina 1962–1964. Ilmoitus ei erittele sotilaiden määrää eikä lokakuun 1962 kuolemia.',
    sources: [
      ['Yhdysvaltain ulkoministeriön historiatoimisto', 'https://history.state.gov/milestones/1961-1968/cuban-missile-crisis'],
      ['Yhdysvaltain ilmavoimien museo: Rudolf Anderson', 'https://www.nationalmuseum.af.mil/Visit/Museum-Exhibits/Fact-Sheets/Display/Article/197542/USAFmuseum/cuban-missile-crisis/'],
      ['Yhdysvaltain ilmavoimien historiikki: Bermudan onnettomuus', 'https://www.generalstaff.org/WW3/Docs/AIR/SAC_40th/SAC_40th_History.htm'],
      ['Bureau of Aircraft Accidents Archives: Guantánamon onnettomuus', 'https://baaa-acro.com/crash/crash-boeing-c-135b-bn-stratolifter-guantanamo-bay-7-killed'],
      ['The Moscow Times: Neuvostoliiton kuolonuhrien ajallinen rajaus', 'https://www.themoscowtimes.com/2017/09/11/russian-defense-ministry-released-data-on-cuban-missile-crisis-a58899'],
      ['BBC: Kuuban näkökulma (National Security Archive)', 'https://nsarchive.gwu.edu/media/29350/ocr'],
    ],
  },
  {
    title: 'Vietnamin sota', years: '1965–1975', region: 'vietnam', first: 'us', tension: 1,
    intro: 'Vietnam on jakautunut Pohjois- ja Etelä-Vietnamiin. Pohjois-Vietnam tukee etelässä taistelevaa Vietkongia ja saa apua Kiinalta ja Neuvostoliitolta. Yhdysvallat lähettää joukkoja tukemaan Etelä-Vietnamia.',
    history: 'Yhdysvallat veti taistelujoukkonsa pois vuonna 1973, mutta vietnamilaiset osapuolet jatkoivat sotaa. Pohjois-Vietnamin joukot valtasivat Etelä-Vietnamin pääkaupungin Saigonin vuonna 1975.',
    human: 'Taistelut ja pommitukset pakottivat ihmisiä lähtemään kodeistaan. Perheet menettivät läheisiään ja elinkeinojaan. Räjähtämättömät ammukset aiheuttivat vaaraa vielä sodan jälkeen.',
    toll: 'Arviolta jopa 2 miljoonaa kuollutta siviiliä',
    scope: 'Uuden-Seelannin kulttuuriministeriön arvio koko sodasta, myös vuotta 1965 edeltäneistä taisteluista. Uhriluvut vaihtelevat lähteittäin.',
    militaryDeaths: [
      ['Pohjois-Vietnam ja Vietkong', 'Yli miljoona'],
      ['Etelä-Vietnam', 'Noin 224 000'],
      ['Yhdysvallat', '58 220'],
      ['Etelä-Korea', '5 099'],
      ['Kiina', 'Noin 1 100'],
      ['Neuvostoliitto', '16'],
    ],
    otherMilitaryDeaths: [['Australia', '521'], ['Thaimaa', '351'], ['Uusi-Seelanti', '37'], ['Filippiinit', '9']],
    otherMilitaryLabel: 'Muita Etelä-Vietnamin tukijoita',
    militaryNote: 'Vietnamilaiset luvut ovat Australian sotamuseon arvioita. Kiina ja Neuvostoliitto tukivat Pohjois-Vietnamia muun muassa ilmatorjunnassa. Neuvostoliiton luku kattaa myös palveluksessa sairauteen kuolleet.',
    sources: [
      ['Uuden-Seelannin kulttuuriministeriö: sodan tausta ja siviiliuhrit (PDF)', 'https://nzhistory.govt.nz/sites/default/files/documents/all-fact-sheets.pdf'],
      ['NZ History: Vietnamin sota ja Uuden-Seelannin sotilaat', 'https://nzhistory.govt.nz/war/vietnam-war'],
      ['Australian sotamuseo: vietnamilaisten tappiot', 'https://www.awm.gov.au/visit/exhibitions/impressions/impressions'],
      ['Australian sotamuseo: Australian sotilaskuolemat', 'https://www.awm.gov.au/articles/encyclopedia/vietnam_mia'],
      ['Yhdysvaltain kansallisarkisto: Yhdysvaltain sotilaskuolemat', 'https://www.archives.gov/research/military/vietnam-war/casualty-statistics'],
      ['Korea Citation Index: Etelä-Korean sotilaskuolemat', 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002605881'],
      ['Yhdysvaltain puolustusministeriön muistojulkaisu: Thaimaa ja Filippiinit (PDF)', 'https://www.vietnamwar50th.com/assets/1/7/VW50th_Allies_Posters_11-6-19REV.pdf'],
      ['National Endowment for the Humanities: Kiinan sotilaskuolemat', 'https://www.neh.gov/humanities/2017/fall/feature/studying-the-vietnam-war'],
      ['VietNamNet: neuvostoliittolaiset sotilasasiantuntijat', 'https://vietnamnet.vn/en/soviet-military-experts-supported-vietnam-s-resistance-for-a-decade-2393016.html'],
    ],
  },
  {
    title: 'Afganistanin sota', years: '1979–1989', region: 'afghanistan', first: 'su', tension: 1,
    intro: 'Neuvostoliitto lähettää joukkonsa Afganistaniin tukemaan kommunistista hallintoa. Afganistanilaiset vastarintaryhmät, joita kutsutaan mujahideeneiksi, taistelevat hallitusta ja neuvostojoukkoja vastaan.',
    history: 'Yhdysvallat tuki vastarintaryhmiä Pakistanin kautta. Neuvostoliitto veti joukkonsa pois vuonna 1989. Afganistanin hallituksen ja vastarintaryhmien välinen sota jatkui.',
    human: 'Miljoonat afganistanilaiset pakenivat maasta, useimmat Pakistaniin tai Iraniin. Kotinsa jättäneille perheille paluu saattoi olla vaarallista vielä joukkojen vetäytymisen jälkeen.',
    toll: 'Arviolta noin miljoona afganistanilaista kuoli',
    scope: 'Arvio kattaa koko vuosien 1979–1989 sodan ja sisältää sekä siviilejä että taistelijoita.',
    militaryDeaths: [
      ['Neuvostoliitto', 'Noin 15 000'],
      ['Afganistanin hallituksen joukot', 'Ei eriteltyä lukua käytetyissä lähteissä'],
      ['Mujahideen-vastarintaryhmät', 'Arviolta noin 90 000'],
      ['Yhdysvallat', 'Tuki vastarintaa lähettämättä taistelujoukkoja'],
    ],
    militaryNote: 'Vastarintaryhmien luku on Pakistanin tiedustelupalvelun arvio, jonka Meduza on raportoinut. Kuolleet afganistanilaiset taistelijat sisältyvät sodan kokonaisarvioon.',
    sources: [
      ['Uppsalan yliopisto: sodan kulku ja osapuolet', 'https://ucdp.uu.se/statebased/736'],
      ['Yhdysvaltain kongressin tutkimuspalvelu: Yhdysvaltain tuki', 'https://www.everycrsreport.com/reports/R45818.html'],
      ['UNHCR: Afganistanin pakolaiset', 'https://www.unhcr.org/news/briefing-notes/afghanistan-10-years-after-soviet-pull-out'],
      ['Yhdysvaltain sotakorkeakoulu: arvio kuolleista afganistanilaisista (PDF)', 'https://media.defense.gov/2024/May/08/2003459840/-1/-1/0/20240506_AFGHANISTAN_1979-89.PDF'],
      ['Meduza: neuvostojoukkojen ja vastarintaryhmien arviot', 'https://meduza.io/en/feature/2019/02/16/the-war-to-start-all-wars'],
    ],
  },
];

const shortRounds = rounds.filter(({ region }) => ['berlin', 'korea', 'cuba'].includes(region));

export function roundsFor(ruleset) {
  return ruleset >= 2 ? rounds : shortRounds;
}

export const nuclearScenarios = {
  korea: {
    toll: 'Noin 9 miljoonaa kuollutta Yhdysvalloissa',
    explanation: 'Tämä on Yhdysvalloissa vuonna 1953 laadittu arvio yhdestä mahdollisesta Neuvostoliiton hyökkäyksestä. Koko sodan uhrimäärään kuuluisivat myös Yhdysvaltain vastaiskun uhrit ja muualla kuolleet. Heille ei tässä laskelmassa annettu lukua.',
    source: ['Yhdysvaltain vuoden 1953 arvion yhteenveto (PDF)', 'https://www.esd.whs.mil/Portals/54/Documents/FOID/Reading%20Room/Litigation_Release/Litigation%20Release%20-%20Assessing%20Nuclear%20Competitions%20in%20the%2021st%20Century%202010.pdf'],
  },
  hungary: {
    toll: 'Noin 70 miljoonaa kuollutta Yhdysvalloissa',
    explanation: 'Yhdysvaltain vuonna 1956 laatima laskelma kuvasi mahdollista ydinsotaa vuonna 1959. Tutkijan asiakirjoista kokoama arvio on noin 71 miljoonaa kuollutta Yhdysvalloissa. Luku koskee vain yhden maan uhreja tässä laskelmassa.',
    source: ['Princetonin yliopistossa laadittu tutkimus: historialliset laskelmat (PDF, s. 45)', 'https://cchyba.scholar.princeton.edu/sites/g/files/toruqf3881/files/cchyba/files/milne_dissertation.pdf'],
  },
  cuba: {
    toll: 'Noin 250 miljoonaa kuollutta yhdessä laskelmassa',
    explanation: 'Yhdysvaltain vuonna 1958 laatima laskelma kuvasi mahdollista ydinsotaa vuonna 1961, vuotta ennen Kuuban kriisiä. Siinä arvioitiin noin 50 miljoonan ihmisen kuolevan Yhdysvalloissa ja noin 196 miljoonan Neuvostoliitossa ja sen liittolaismaissa, joihin laskelma luki myös Kiinan.',
    source: ['National Security Archive: arvio vuoden 1961 ydinsodasta', 'https://nsarchive.gwu.edu/briefing-book/nuclear-vault/2022-07-14/long-classified-us-estimates-nuclear-war-casualties-during'],
  },
  vietnam: {
    toll: 'Noin 210–220 miljoonaa kuollutta kahdessa laskelmassa',
    explanation: 'Yhdysvaltain vuonna 1969 laatimat skenaariot kuvasivat mahdollista ydinsotaa noin vuonna 1970. Luvut ovat arvioita Yhdysvalloissa ja Neuvostoliitossa kuolleista kahdessa eri skenaariossa.',
    source: ['Yhdysvaltain kansallisarkisto: vuoden 1969 arviot (PDF, taulukko 4)', 'https://www.archives.gov/files/declassification/iscap/pdf/2009-090-doc1.pdf'],
  },
  afghanistan: {
    toll: 'Yli 250 miljoonaa olisi voinut kuolla',
    explanation: 'Yhdysvaltain kongressille laaditun vuoden 1979 arvion mukaan täysimittainen ydinsota olisi voinut tappaa yli 250 miljoonaa ihmistä pelkästään Yhdysvalloissa ja Neuvostoliitossa. Tuhon laajuus riippuisi sodan kulusta.',
    source: ['Yhdysvaltain kongressin arvio ydinsodan kuolonuhreista (PDF)', 'https://www.govinfo.gov/content/pkg/CHRG-96hhrg54689Op1/pdf/CHRG-96hhrg54689Op1.pdf'],
  },
};
