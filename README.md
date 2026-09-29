# MIRAFIORE — *Fiorire in Inverno*

Brand identity + sito one-page (motion scroll) per una maison italiana di **borse e calzature con motivi floreali**, collezione **Autunno / Inverno 2026—2027**.

## Il brand
| | |
|---|---|
| **Nome** | MIRAFIORE (mira + fiore: "guarda il fiore") |
| **Payoff** | Fiorire in Inverno |
| **Positioning** | Quiet luxury botanico, artigianato italiano, motivi floreali tono su tono |
| **Logo** | Monogramma **M**: due steli che si incontrano, aste che terminano in petali, seme centrale |
| **Tipografia** | Cormorant Garamond (display) + Jost 300/400 (testo) |

## Palette AW 2026/27
`#4E1B23` Oxblood Bloom · `#26382E` Foglia Notturna · `#8A6A52` Mocha Velluto · `#D9C8B4` Bruma · `#B9975B` Oro Antico · `#14100F` Nero Seta

## Contenuti del sito
1. Hero cinematografica con reveal a maschera + parallax
2. Manifesto con evidenziazione parola-per-parola allo scroll
3. Palette interattiva
4. **Collezione**: sezione pinnata a scorrimento orizzontale (4 prodotti + CTA)
5. Erbario / motivi floreali con pattern in parallax
6. Identità: monogramma, lockup, sistema tipografico, mockup packaging
7. **Spot 30″**: storyboard + voce off riprodubile (`assets/audio/spot-mirafiore.mp3`)
8. **Campagna social**: post feed 4:5, reel/story 9:16, KPI del rollout
9. Trend moda 2026/27
10. Footer con iscrizione lookbook

## Tecnologia
HTML + CSS + JavaScript vanilla, nessuna dipendenza. Motion engine custom (`assets/js/app.js`): loop rAF con lerp, parallax scroll-linked, pin orizzontale, marquee reattivo alla velocità di scroll, IntersectionObserver reveals, cursore custom, waveform audio.

## Avvio locale
```bash
python3 -m http.server 3000
# http://localhost:3000
```

> Tutte le immagini sono generate con AI a scopo di presentazione del concept.
