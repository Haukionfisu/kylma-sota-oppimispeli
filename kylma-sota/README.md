# Kylmä sota – oppimispeli

Pelattava prototyyppi 8. luokalle. Kuusi kierrosta käsittelevät Berliinin saartoa, Korean sotaa, Unkarin kansannousua, Kuuban ohjuskriisiä, Vietnamin sotaa ja Afganistanin sotaa. Molemmat pelaavat omalla selaimellaan ja liittyvät samaan huoneeseen kuusimerkkisellä koodilla.

Pelaajat saavat kolme korttia. Jokaisessa kriisissä kumpikin tekee yhden salaisen avaussiirron ja yhden avoimen siirron. Kolmas kortti siirtyy seuraavaan kriisiin. Kortin voi käyttää tapahtumana, vaikutusvallan lisäämiseen, painostukseen tai avaruuskilpaan. Vastustajan tapahtuma toteutuu myös toimintapisteitä käytettäessä. Avaruuskilpa tarjoaa tavan käyttää kortti ilman sen tapahtumaa. Pisteytyskortit ja avaruuskilpa tuovat pisteitä alueiden loppupisteytyksen lisäksi.

## Kokeile omalla koneella

1. Pura ZIP-tiedosto ja avaa purettu kansio päätteessä. Tarvitset Node.js:n (versio 22 tai uudempi).
2. Käynnistä peli komennolla `node src/local.js`.
3. Avaa osoite `http://127.0.0.1:8787` kahdessa selainikkunassa, joista toinen on yksityisessä selaustilassa. Luo ensimmäisellä ikkunalla huone ja liity siihen toisella ikkunalla.

Paikallinen kokeilu käyttää muistissa olevaa pelitilaa. Kun suljet palvelimen, pelihuoneet tyhjenevät.

## Julkaise Cloudflareen

1. Asenna julkaisemiseen tarvittava Wrangler komennolla `npm install`.
2. Kirjaudu Cloudflare-tilillesi komennolla `npx wrangler login`.
3. Julkaise komennolla `npm run deploy`. Tarvittaessa määritä tilillesi `workers.dev`-aliverkkotunnus Cloudflaren hallintapaneelissa.
4. Avaa komennon ilmoittama osoite kahdella selaimella, kokeile huoneen perustamista ja liittymistä ja jaa osoite oppilaille.

Cloudflare Workers tarjoilee pelisivun. Jokaisen huoneen pelitila on omassa SQLite-pohjaisessa Durable Objectissa ja poistuu 12 tunnin kuluttua huoneen luomisesta. Odottava selain tarkistaa pelitilan noin kolmen sekunnin välein. Peli ei kysy oppilaan nimeä tai sähköpostiosoitetta.

## Opetuskäyttö

Pelin jännitemittari kuvaa suoran suurvaltasodan riskiä. Kummallakin on kierroksella mahdollisuus vaikuttaa mittariin. Jos jännite on yhä korkeimmillaan kierroksen päättyessä, pelissä syttyy ydinsota ja molemmat häviävät. Ydinsodan loppuruutu kertoo aikakauden kuolonuhrien arviosta ja sodan mahdollisista seurauksista yhteiskunnille. Korean sodan esimerkki muistuttaa, että suursodan välttäminen ei suojannut muita maita sodalta.

Loppunäkymä kertoo, mitä pelaajat valitsivat ja mitä historiallisesti tapahtui. Sotilaskuolemat ovat kriisikohtaisissa taulukoissa osapuolittain. Kuolinluvut on otettu loppunäkymässä linkitetyistä lähteistä. Luvut kuvaavat eri tavoin rajattuja ihmisryhmiä, joten niitä ei yhdistetä yhteissummaksi. Pelaajien valintojen vaikutukset ihmisiin kuvataan sanallisesti. Lopussa oppilaat voivat keskustella päätöstensä seurauksista ja verrata niitä historiaan.
