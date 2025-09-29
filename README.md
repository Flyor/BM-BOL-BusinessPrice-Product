# BM Bol Business + ST auf Produktseite

Ein Tampermonkey-Skript zur Anzeige von BOL Business-Preisen und SmythsToys-Preisen auf BrickMerge Produktseiten.

## 📋 Funktionen

### BOL Business Preis
- **Automatische Berechnung** des BOL Business-Preises (13% Rabatt auf den regulären BOL-Preis)
- **UVP-Vergleich** mit prozentualem Rabatt gegenüber der unverbindlichen Preisempfehlung
- **Code-Erkennung** für spezielle BOL-Angebote

### SmythsToys Integration
- **Automatische Produktsuche** auf SmythsToys basierend auf der LEGO Set-Nummer
- **Preisvergleich** mit aktuellen SmythsToys-Preisen
- **Rabatt-Anzeige** wenn verfügbar
- **Direkter Link** zur SmythsToys-Produktseite

### Benutzeroberfläche
- **Fixed Position Display** oben rechts auf der Seite
- **Schwarzer Dialog** mit weißer Schrift für gute Lesbarkeit
- **Responsive Design** mit maximaler Breite von 300px
- **Automatische Aktualisierung** bei Seitennavigation

## 🔧 Installation

1. **Tampermonkey installieren** (falls nicht bereits vorhanden):
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/de/firefox/addon/tampermonkey/)

2. **Skript installieren**:
   - Das `.user.js` Skript in Tampermonkey importieren
   - Oder direkt von GitHub installieren (falls verfügbar)

3. **Aktivierung**:
   - Das Skript ist automatisch auf `https://www.brickmerge.de/*` aktiv
   - Keine weitere Konfiguration erforderlich

## 🎯 Verwendung

1. **BrickMerge Produktseite öffnen**:
   ```
   https://www.brickmerge.de/[SET-NUMMER]-[VARIANTE]_[PRODUKTNAME]
   ```
   Beispiel: `https://www.brickmerge.de/76178-1_lego-super-heroes-daily-bugle`

2. **Automatische Anzeige**:
   - Das Skript erkennt automatisch die LEGO Set-Nummer
   - Berechnet den BOL Business-Preis
   - Sucht das Produkt bei SmythsToys
   - Zeigt beide Preise in einem Dialog an

3. **Dialog-Inhalt**:
   ```
   BOL Business Preis: XX,XX €
   Rabatt: XX%
   ─────────────────────────
   SmythsToys Preis: XX,XX €
   Rabatt: XX%
   Zu SmythsToys (Link)
   ```

## 🔍 Technische Details

### Unterstützte URL-Formate
- `/[4-5 Stellig]-[Nummer]_[Name]` (Standard)
- `/[4-5 Stellig]-` (Alternative)

### Selektoren
- **BOL-Preis**: `[data-mid="439"] .price`
- **UVP**: Paragraph mit "UVP:" Text
- **Referenzelement**: `div.medium-1.small-3.columns.text-center img[alt="Nach Shop filtern"]`

### SmythsToys Integration
- **Such-URL**: `https://www.smythstoys.com/de/de-de/search?text=lego+[SET-NUMMER]`
- **Timeout**: 10 Sekunden
- **Fallback-Selektoren** für robuste Preis-Erkennung

## 🛠️ Fehlerbehebung

### Dialog wird nicht angezeigt
- Öffnen Sie die Browser-Konsole (F12)
- Prüfen Sie auf Debug-Meldungen mit Präfix des Skripts
- Das Skript versucht bis zu 10 Mal, das Referenzelement zu finden

### SmythsToys-Preis nicht verfügbar
- Produkt möglicherweise nicht bei SmythsToys verfügbar
- Netzwerkprobleme oder CORS-Beschränkungen
- Seitenstruktur von SmythsToys hat sich geändert

### BOL-Preis nicht erkannt
- BOL ist möglicherweise nicht in der Shop-Liste
- Preisformat hat sich geändert
- Shop-ID (439) ist nicht korrekt

## 📊 Berechnungen

### BOL Business Rabatt
```javascript
Business-Preis = BOL-Preis × 0.87  // 13% Rabatt
```

### UVP-Rabatt
```javascript
Rabatt% = Math.round((1 - (Business-Preis / UVP)) × 100)
```

## 🔄 Aktualisierungen

Das Skript unterstützt automatische Updates über:
- **UpdateURL**: GitHub Repository (falls konfiguriert)
- **DownloadURL**: Direkte Skript-URL

## ⚠️ Hinweise

- **Nur für private Nutzung** - Respektieren Sie die Nutzungsbedingungen der Websites
- **Preise ohne Gewähr** - Immer die offiziellen Shop-Seiten für finale Preise prüfen
- **Performance** - Das Skript macht externe Anfragen, was die Seitenladezeit beeinflussen kann

## 🐛 Probleme melden

Bei Problemen oder Verbesserungsvorschlägen:
1. Browser-Konsole auf Fehlermeldungen prüfen
2. Problematische URL und Fehlermeldung dokumentieren
3. GitHub Issues erstellen (falls Repository verfügbar)

## 📜 Version

Aktuelle Version: **2.1.0**

Siehe [CHANGELOG.md](CHANGELOG.md) für detaillierte Änderungen.
