# 🚢 Maritime Cybersecurity Calendar 2026

Bilingual (English/Polish) calendar of conferences, summits, and events dedicated to cybersecurity in the maritime sector for 2026.

![Hugo](https://img.shields.io/badge/Hugo-0.123+-FF4088?logo=hugo)
![License](https://img.shields.io/badge/License-MIT-green)
![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20PL-blue)

## 🌊 About

This calendar aggregates information about the most important Maritime Cybersecurity events worldwide, including:

- **Dedicated maritime cyber conferences** (NORMA Cyber, NATO NMIOTC, MTS-ISAC, EMSA)
- **Maritime conferences with cyber tracks** (SMM Hamburg, Posidonia, Singapore Maritime Week)
- **Trade fairs and expos** with cybersecurity elements (EURONAVAL, Autonomous Ship Expo)
- **Workshops and trainings** by IMO, BIMCO, IACS

## 🌐 Languages

The calendar is available in two languages:
- **English** (default) - `/`
- **Polish** - `/pl/`

Switch languages using the flag icons (🇬🇧/🇵🇱) in the header.

## 📅 Included Events

The calendar contains **30+ events** from **15 countries** for 2026:

| Event | Date | Location | Type |
|-------|------|----------|------|
| NORMA Cyber Conference | April | Oslo 🇳🇴 | Conference |
| NATO NMIOTC Cyber Security | September | Crete 🇬🇷 | Conference |
| SMM Hamburg | September | Hamburg 🇩🇪 | Expo |
| MTS-ISAC Summit | May | Baltimore 🇺🇸 | Summit |
| EMSA Maritime Cyber | October | Lisbon 🇵🇹 | Conference |
| IMO Cyber-SHIP Lab Symposium | November | London 🇬🇧 | Symposium |
| Digital Baltic | June | Gdynia 🇵🇱 | Conference |
| ... | ... | ... | ... |

## 🚀 Local Development

### Requirements
- Hugo Extended v0.123.7+

### Installation

**macOS:**
```bash
brew install hugo
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt install hugo
```

**Windows:**
```bash
choco install hugo-extended
```

### Running

```bash
# Clone repository
git clone https://github.com/your-username/maritime-cyber-calendar.git
cd maritime-cyber-calendar

# Start dev server
hugo server

# Open http://localhost:1313/
# Polish version at http://localhost:1313/pl/
```

### Production Build

```bash
hugo --minify
# Output files in ./public/
```

## 📁 Project Structure

```
maritime-cyber-calendar/
├── hugo.toml              # Hugo configuration (multilingual)
├── data/
│   └── conferences.yaml   # 📊 Conference database (English)
├── content/
│   ├── _index.md          # Homepage (EN)
│   ├── _index.pl.md       # Homepage (PL)
│   ├── about.md           # About page (EN)
│   └── about.pl.md        # About page (PL)
├── i18n/
│   ├── en.yaml            # English translations
│   └── pl.yaml            # Polish translations
├── layouts/
│   ├── _default/
│   ├── index.html
│   └── partials/
│       ├── header.html    # With language switcher
│       └── footer.html
├── static/
│   ├── css/style.css
│   └── js/main.js
└── .github/workflows/
    └── hugo.yml           # Auto-deploy to GitHub Pages
```

## ➕ Adding Events

Edit `data/conferences.yaml` (all data in English):

```yaml
- name: "Conference Name"
  year: 2026
  description: "Event description in English..."
  link: "https://example.com"
  cfp_link: "https://example.com/cfp"      # Optional
  cfp_deadline: "2026-06-15"               # Optional
  date_start: "2026-09-15"
  date_end: "2026-09-16"
  place: "City"
  country_code: "PL"                        # ISO 3166-1 code
  tags: ["maritime-cyber", "ot-security"]
  type: "conference"                        # conference|summit|expo|forum|symposium|training
  price: "€200-400"
  online: false
  cyber_track: true                         # Has dedicated cyber track
  tentative_date: false                     # Is date tentative
```

### Supported Country Codes

| Code | Country | Flag |
|------|---------|------|
| NO | Norway | 🇳🇴 |
| GR | Greece | 🇬🇷 |
| US | USA | 🇺🇸 |
| DE | Germany | 🇩🇪 |
| GB | United Kingdom | 🇬🇧 |
| FR | France | 🇫🇷 |
| NL | Netherlands | 🇳🇱 |
| PT | Portugal | 🇵🇹 |
| PL | Poland | 🇵🇱 |
| SG | Singapore | 🇸🇬 |
| JP | Japan | 🇯🇵 |
| CA | Canada | 🇨🇦 |
| BE | Belgium | 🇧🇪 |
| LV | Latvia | 🇱🇻 |
| FI | Finland | 🇫🇮 |

## 🌐 Deployment

### GitHub Pages (automatic)

1. Fork repository
2. Enable GitHub Pages in Settings → Pages → Source: GitHub Actions
3. Push to `main` triggers automatic build and deploy

### Netlify

1. Connect repository
2. Build command: `hugo --minify`
3. Publish directory: `public`
4. Environment variable: `HUGO_VERSION` = `0.123.7`

### Cloudflare Pages

1. Connect repository
2. Framework preset: Hugo
3. Build command: `hugo --minify`

## 🔗 Data Sources

Event information comes from official organizer websites:

- [NORMA Cyber](https://www.normacyber.no)
- [NATO NMIOTC](https://nmiotc.nato.int)
- [EMSA](https://www.emsa.europa.eu)
- [MTS-ISAC](https://www.mtsisac.org)
- [France Cyber Maritime](https://www.france-cyber-maritime.eu)
- [IMO](https://www.imo.org)
- [SMM Hamburg](https://www.smm-hamburg.com)
- [Posidonia](https://posidonia-events.com)
- [Singapore Maritime Week](https://www.smw.sg)

## 📄 License

MIT License - free to use and modify.

## 🤝 Contributing

Pull requests are welcome! Especially:
- Adding new events
- Updating dates and links
- Bug fixes
- Translations

---

*Project inspired by [konferencje.szurek.tv](https://konferencje.szurek.tv)*

*Built for the Maritime Cybersecurity community* 🚢🔒
