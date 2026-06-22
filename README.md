# Jimat 🛒 — Best Buy Malaysia

> **Beli Bijak · Jimat Lebih** — A privacy-first PWA for Malaysian shoppers to compare grocery prices, check halal ingredient status, and manage shopping lists — entirely in the browser, no account required.

---

## Live App

**https://energyintervention-rgb.github.io/JimatPRO**

---

## Features

### 🏷️ Price Comparison (`Compare` tab)
- Add multiple items with product name, price, quantity, unit, store, and optional discount %
- Compares price-per-unit across all items and ranks them from cheapest to most expensive
- Highlights the best-value item and shows how much you save vs. the most expensive option
- **Quick Add** — browse a built-in product catalogue (12 categories, ~100 common Malaysian grocery items) to populate item names instantly
- **Price Tag Scanner** — point your camera at a shelf price tag; Tesseract.js OCR reads the price and auto-fills the input
- **Currency Converter** — live exchange rates via [Frankfurter API](https://www.frankfurter.app); supports MYR, USD, SGD, AUD, GBP, EUR, JPY, CNY, THB, IDR, SAR, AED
- Share comparison results as a formatted WhatsApp message or PNG card

### 📋 Shopping List (`List` tab)
- Add items manually or send the winner from a comparison directly to the list
- Tick off items as you shop; estimated total shown
- Persists locally via `localStorage`

### 📖 Comparison History (`History` tab)
- Auto-saves every comparison result with date, winner, price-per-unit, and item breakdown
- One-tap to re-add a past winner to the shopping list

### 📷 Price Survey (`Survey` tab)
- Capture shelf price tag photos with your camera
- Tag each photo with store name and a note (e.g. "Milo 1kg RM8.90")
- Photos stored locally in **IndexedDB** (survives page reload, private to device)
- Share individual survey photos via WhatsApp or Web Share API

### ✅ Halal & Ingredient Check (`Info` tab)
- **Type or paste** a list of E-codes or ingredient names (e.g. `E471, E120, Gelatin`)
- **Barcode scanner** — uses camera + Quagga2 to read product barcodes; decoded barcode opens a Google search for that product's halal status
- **OCR Label scanner** — photograph a product label; Tesseract.js extracts text for ingredient checking
- **E-code dropdown** — browse all common E-codes grouped by category
- Results classified into three tiers:
  - ✅ **Halal** — confirmed safe
  - ⚠️ **Mushbooh** — needs verification (source-dependent)
  - 🚫 **Haram / Contains concern** — flagged as problematic
- Authority sources cited per item: JAKIM, MUIS, MUI, SFDA, HFA, IFANCA, SANHA, ESMA
- **Read Aloud** — Web Speech API TTS reads the result summary
- **External search shortcuts** — open Google, Carian Halal MY, Open Food Facts, or a nutrient search for any ingredient
- Share halal check results as PNG card via WhatsApp

#### Halal Database (`halal-db.json`)
| Category | Count |
|---|---|
| Haram | 38 |
| Mushbooh / Warn | 84 |
| Safe / Confirmed Halal | 196 |
| **Total entries** | **318** |

Database version: **2.0** (updated April 2026). Loaded at runtime; falls back to an embedded subset if fetch fails.

---

## Technical Stack

| Layer | Technology |
|---|---|
| App shell | Single-file `index.html` (vanilla JS, no framework) |
| Fonts | Google Fonts — Syne (headings), DM Mono (body) |
| OCR | [Tesseract.js v5](https://unpkg.com/tesseract.js@5) — `eng+msa` language pack |
| Barcode | [Quagga2 v1.8.4](https://cdn.jsdelivr.net/npm/@ericblade/quagga2) |
| Screenshot / share card | [html2canvas v1.4.1](https://cdnjs.cloudflare.com/ajax/libs/html2canvas) |
| Currency rates | [Frankfurter API](https://api.frankfurter.app) (free, no key required) |
| Local storage | `localStorage` (settings, shopping list, history) + `IndexedDB` (survey photos) |
| PWA | Service worker (`sw.js`), `manifest.json`, offline-capable |
| Hosting | GitHub Pages |

**No backend. No account. No data leaves the device** (except currency rate fetch and external search links).

---

## PWA Installation

The app is installable as a home screen app on Android and iOS.

- **Android (Chrome):** Tap the browser menu → *Add to Home screen*
- **iOS (Safari):** Tap Share → *Add to Home Screen*

App shortcuts defined in `manifest.json`:
- `?tab=compare` — jump straight to price comparison
- `?tab=info` — jump straight to halal check

---

## Accessibility / Modes

- **Elderly / Bright Mode** (`☀️ Cerah` toggle) — switches to a high-contrast light theme with larger font sizes, bigger touch targets, and increased button padding. Preference saved to `localStorage`.
- **Bilingual** — full UI in Bahasa Malaysia (`MY`) and English (`EN`), switchable at any time. All labels, placeholders, and system messages are translated.

---

## File Structure

```
JimatPRO/
├── index.html        # Entire app — UI, logic, styles in one file
├── manifest.json     # PWA manifest (name, icons, shortcuts, theme)
├── sw.js             # Service worker — offline cache + update banner
├── halal-db.json     # Halal ingredient database v2.0 (318 entries)
├── icon.png          # App icon 192×192 (apple-touch-icon)
├── icon-192.png      # PWA icon 192×192
├── icon-512.png      # PWA icon 512×512
└── barcode_test.html # Development/test page for barcode scanner
```

---

## Deployment

The app is hosted as a static site on **GitHub Pages** under the `energyintervention-rgb` organisation.

No build step is required — push changes to the repository and GitHub Pages serves the updated files. The service worker handles cache busting and shows an in-app update banner when a new version is detected.

App version string in `index.html`: `800200` (meta tag `app-version`).

---

## Known Limitations & Notes

- OCR accuracy depends on image quality and lighting; results should be verified manually.
- Barcode scanning opens a Google search — it does not query a product database directly.
- Currency rates are fetched live; the converter shows `Fetching rate...` if the Frankfurter API is unreachable.
- Survey photos are stored in **IndexedDB on-device only** — clearing browser data will delete them.
- Tesseract.js downloads language data (~10 MB) on first use of the OCR feature.

---

## License

Not specified in repository. All rights reserved to the project owner unless stated otherwise.
