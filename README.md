# Alarmfase Rood – website (Next.js)

Dit is een snelle, professionele podcast-website die afleveringen automatisch inlaadt via je Springcast RSS-feed.

## 1) Installeren
```bash
npm install
```

## 2) Configuratie
Maak een bestand `.env.local` in de root met:

```bash
PODCAST_RSS_URL="https://JOUW-SPRINGCAST-RSS-FEED.xml"
SITE_URL="https://jouwdomein.nl"
```

**Waar vind je de RSS?** In Springcast bij je podcast-instellingen (RSS-feed URL).

## 3) Runnen
```bash
npm run dev
```
Open http://localhost:3000

## 4) Deploy (aanrader: Vercel)
- Push naar GitHub
- Import in Vercel
- Zet environment variables `PODCAST_RSS_URL` en `SITE_URL`
- Koppel je domein

## Aanpassen
- Styling: `app/globals.css` + Tailwind config
- Pagina’s: `app/*`
- Podcast metadata/afleveringen: `lib/rss.ts`


## Afbeeldingen
- `public/images/hero.png` = hero-visual (de grote afbeelding rechts)
- `public/images/helpers-strip.png` = iconenstrip bovenaan


### Geen RSS ingesteld?
Als `PODCAST_RSS_URL` ontbreekt, probeert de site automatisch de RSS-feed te vinden via `NEXT_PUBLIC_PODCAST_PAGE_URL` (standaard: de Alarmfase Rood Springcast pagina).
