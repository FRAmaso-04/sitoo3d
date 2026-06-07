# T-Shirt 3D Experience

Sito one-page cinematografico per un brand di abbigliamento. Una maglietta 3D ruota mentre l'utente scrolla, con testi che raccontano tessuto, design e storia del brand. Ambiente: isola volante tra le nuvole, cielo diurno che sfuma da azzurro a corallo.

**Stack:** Next.js 14 · React Three Fiber · GSAP ScrollTrigger · Framer Motion · Tailwind CSS · TypeScript

---

## Avvio rapido

### Prerequisiti

- Node.js 18+
- npm 9+

### Installazione

```bash
git clone https://github.com/FRAmaso-04/sitoo3d.git
cd sitoo3d
npm install
```

### Sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

### Build produzione

```bash
npm run build
npm run start
```

### Test

```bash
npm run test          # run singolo
npm run test:watch    # watch mode
```

---

## Deploy su Vercel

1. Collega il repo a [Vercel](https://vercel.com)
2. Framework: **Next.js** (rilevato automaticamente)
3. Nessuna variabile d'ambiente richiesta
4. `npm run build` deve passare prima di ogni deploy

---

## Struttura del progetto

```
src/
├── app/
│   ├── layout.tsx              # font, metadata SEO
│   ├── page.tsx                # assembla Intro + Experience + Outro
│   └── globals.css             # CSS vars, grain overlay, reset
├── components/
│   ├── scene/
│   │   ├── ExperienceScene.tsx # Canvas R3F + luci + fog
│   │   ├── SkyDome.tsx         # cielo gradiente
│   │   ├── Clouds.tsx          # nuvole animate
│   │   ├── FloatingIsland.tsx  # isola volante
│   │   ├── DropModel.tsx       # placeholder cilindro → futuro .glb
│   │   ├── ModelCarousel.tsx   # slot drop + swap + idle spin
│   │   ├── CameraRig.tsx       # orbita 360° guidata dallo scroll
│   │   └── Dust.tsx            # particelle polline/vento
│   ├── ui/
│   │   ├── ScrollStage.tsx     # GSAP pin 400vh + progress ref
│   │   ├── ChapterOverlay.tsx  # 4 capitoli di testo (Framer Motion)
│   │   ├── StoryPanel.tsx      # pannello storia slide-in
│   │   ├── ExploreHUD.tsx      # selettore drop (dots, frecce, CTA)
│   │   └── ScrollHint.tsx      # indicatore "scroll to explore"
│   └── layout/
│       ├── IntroSection.tsx    # logo + entrata cinematografica
│       └── OutroSection.tsx    # footer
└── lib/
    ├── progress-context.tsx    # context per progress 0→1
    ├── drops.ts                # config drop {code, name, model, garment, accent}
    └── utils.ts                # cn() helper
```

---

## Aggiungere modelli 3D reali

I drop sono ora rappresentati da cilindri neri placeholder. Quando i `.glb` sono pronti:

1. Mettere i file in `public/models/`:
   - `drop-01.glb` → THE RED PINE
   - `drop-02.glb` → NORTHWIND
   - `drop-03.glb` → EMBER

2. Modificare **solo** `src/components/scene/DropModel.tsx`:

```tsx
// Sostituire il cilindro con:
const { scene } = useGLTF(modelUrl);
return <primitive object={scene.clone()} />;
```

3. Nient'altro cambia: camera, scroll, ambiente e selettore restano identici.

**Requisiti del modello:** altezza ~2.2 unità, centrato sull'origine, Draco compression, < 5 MB per drop.

---

## Config drop (`src/lib/drops.ts`)

```ts
export const DROPS = [
  { code: 'DROP 01', name: 'THE RED PINE', model: '/models/drop-01.glb', garment: '#161616', accent: '#CC1111' },
  { code: 'DROP 02', name: 'NORTHWIND',    model: '/models/drop-02.glb', garment: '#14181E', accent: '#6FA8C7' },
  { code: 'DROP 03', name: 'EMBER',        model: '/models/drop-03.glb', garment: '#1E150F', accent: '#D98441' },
];
```

Aggiungere nuovi drop all'array: HUD, dots e slot si aggiornano automaticamente.

---

## Palette brand

| Token | Hex | Uso |
|-------|-----|-----|
| `--dark` | `#080808` | nero brand, UI |
| `--red` | `#CC1111` | unico rosso, accent |
| `--cream` | `#E8D5B0` | testo caldo |
| `--white` | `#F5F5F0` | testo ad alto contrasto |
| `--smoke` | `#5A5246` | testi secondari |
| `--sky-top` | `#3E6E94` | cielo in alto |
| `--sky-coral` | `#C9784E` | banda corallo |
| `--sky-paper` | `#EBD9B6` | orizzonte carta |
| `--fog` | `#C79A72` | nebbia calda |

---

## Note tecniche

- `progress` 0→1 è una `useRef` mutabile — **mai** `useState` per non causare re-render a ogni frame
- La camera è guidata da GSAP ScrollTrigger; OrbitControls non è usato in produzione
- Lo sfondo (sky/clouds/island/dust) è condiviso tra tutti i drop e non reagisce al cambio di modello
- `ExperienceScene` è caricato con `dynamic(..., { ssr: false })` — nessun SSR del WebGL
- Fallback statico attivo se WebGL non è disponibile
- `prefers-reduced-motion` supportato: niente scrub drammatico, nuvole quasi ferme
