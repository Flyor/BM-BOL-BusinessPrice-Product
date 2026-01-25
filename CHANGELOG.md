# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt der [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.2] - 2025-01-XX

### 🔄 Geändert
- **Shop-Umstellung**: Anpassung von bol.de auf buecher.de
- **Text-Referenzen**: Alle "BOL" Texte wurden zu "Bücher.de" geändert
- **Skript-Name**: Aktualisiert auf "BM Bücher.de Business + ST auf Produktseite"
- **Beschreibung**: Angepasst für buecher.de Business-Preise
- **Shop-ID**: Aktualisiert von `data-mid="439"` auf `data-mid="447"` für buecher.de

### 📝 Hinweise
- Die Shop-ID wurde auf 447 geändert, da buecher.de eine neue ID auf BrickMerge hat
- Funktionalität bleibt vollständig erhalten, nur die Bezeichnungen und Shop-ID wurden angepasst

---

## [2.1.1] - 2025-09-29

### 🔧 Behoben
- **SmythsToys-Rabatt-Berechnung**: Rabatt wird jetzt korrekt basierend auf UVP berechnet statt nur aus Discount-Element gelesen
- **Immer 0% Rabatt Problem**: SmythsToys-Rabatt wird nun wie BOL Business-Rabatt berechnet (UVP vs. aktueller Preis)

### ✨ Hinzugefügt
- **Intelligente Rabatt-Berechnung**: SmythsToys-Rabatt wird aus UVP und SmythsToys-Preis errechnet
- **Fallback-Mechanismus**: Wenn UVP-basierte Berechnung fehlschlägt, wird weiterhin das Discount-Element verwendet
- **Erweiterte Debug-Ausgaben**: Rabatt-Berechnung wird in der Konsole protokolliert

### 🔄 Geändert
- **Rabatt-Logik**: SmythsToys verwendet jetzt dieselbe Berechnungsmethode wie BOL Business
- **Preis-Parsing**: Verbesserte Extraktion von numerischen Werten aus SmythsToys-Preisen

---

## [2.1.0] - 2025-09-29

### 🔧 Behoben
- **Dialog-Sichtbarkeitsproblem**: Robuste Lösung für intermittierend nicht erscheinende Dialoge
- **SmythsToys-Preis-Erkennung**: Verbesserte Produktsuche und Preis-Extraktion
- **Timing-Probleme**: Ersetzt starres 2-Sekunden-Timeout durch intelligente Element-Erkennung
- **Doppelte Dialoge**: Verhindert mehrfache Anzeige durch ID-basierte Prüfung

### ✨ Hinzugefügt
- **Intelligente Element-Erkennung**: `waitForElement()` Funktion mit MutationObserver
- **Retry-Mechanismus**: Bis zu 10 Versuche mit progressiven Timeouts
- **SPA-Unterstützung**: Automatische Erkennung von URL-Änderungen ohne Seitenneuladen
- **Erweiterte URL-Parsing**: Unterstützung für verschiedene BrickMerge URL-Formate
- **Fallback-Selektoren**: Multiple Selektoren für SmythsToys-Elemente
- **Timeout-Behandlung**: 10-Sekunden-Timeout für externe Anfragen
- **Verbesserte Fehlerbehandlung**: Spezifische Fehlermeldungen für verschiedene Szenarien
- **Debug-Ausgaben**: Konsistente `console.debug` Verwendung

### 🔄 Geändert
- **Produktnummer-Extraktion**: 
  - Unterstützt jetzt `/12345-1_name` und `/12345-` Formate
  - Funktioniert mit 4-5 stelligen Set-Nummern
- **SmythsToys-Integration**:
  - Multiple Selektoren für Produkttitel: `div[data-test="card-title"] h2`, `.product-name h2`, `.product-title`, `h2[data-test="product-title"]`
  - Multiple Selektoren für Preise: `.ios-price .text-price-lg`, `.price .current-price`, `.product-price .price`, `[data-test="price"]`
  - Verbesserte Rabatt-Erkennung mit flexibleren Patterns
- **Preis-Display**:
  - Eindeutige ID (`#bm-price-display`) für bessere Verwaltung
  - Erweiterte CSS-Eigenschaften (`borderRadius`, `fontFamily`, `fontSize`, `maxWidth`)
  - Bessere Lesbarkeit und modernes Design
- **Logging**: Umstellung von `console.log/error/warn` auf `console.debug` für Debugging

### 🏗️ Technische Verbesserungen
- **Promise-basierte Architektur**: Moderne async/await-ähnliche Struktur
- **Observer Pattern**: MutationObserver für DOM-Änderungen
- **Graceful Degradation**: Fallback-Mechanismen bei Fehlern
- **Memory Management**: Automatische Cleanup von Event Listeners
- **Performance**: Reduzierte DOM-Queries durch intelligente Caching-Strategien

### 📋 Code-Qualität
- **Konsistente Einrückung**: 4 Leerzeichen Standard
- **Einheitliche Variablen-Deklaration**: `const`/`let` statt `var` wo möglich
- **Bessere Kommentierung**: Detaillierte Inline-Dokumentation
- **Error Boundaries**: Try-catch-Blöcke für kritische Bereiche
- **Type Safety**: Bessere Typ-Prüfungen vor DOM-Operationen

### 🧪 Getestete Szenarien
- **URL-Parsing**: Erfolgreich getestet mit Daily Bugle (76178-1)
- **Element-Erkennung**: Robuste Funktion auch bei langsamen Verbindungen
- **Navigation**: Korrekte Cleanup und Neuinitialisierung bei URL-Änderungen
- **Fehlerbehandlung**: Graceful Fallbacks bei nicht verfügbaren Elementen

---

## [2.0.0] - Frühere Version

### Ursprüngliche Funktionen
- **BOL Business Preis-Berechnung**: 13% Rabatt auf BOL-Preise
- **UVP-Vergleich**: Automatische Rabatt-Berechnung gegenüber UVP
- **SmythsToys-Integration**: Grundlegende Produktsuche und Preis-Anzeige
- **Fixed Position Dialog**: Positionierung oben rechts
- **Basis-Styling**: Schwarzer Dialog mit weißer Schrift

### Bekannte Probleme (behoben in 2.1.0)
- Intermittierend nicht erscheinende Dialoge
- SmythsToys-Preise wurden teilweise als "Nicht verfügbar" angezeigt
- Starres 2-Sekunden-Timeout führte zu Race Conditions
- Keine Behandlung von URL-Änderungen ohne Seitenneuladen
- Begrenzte Robustheit gegen Seitenstruktur-Änderungen

---

## Upgrade-Hinweise

### Von 2.0.0 auf 2.1.0
- **Keine Breaking Changes**: Vollständig rückwärtskompatibel
- **Automatische Verbesserungen**: Alle Probleme werden automatisch behoben
- **Neue Features**: Funktionieren sofort ohne Konfiguration
- **Performance**: Merkbare Verbesserung der Zuverlässigkeit

### Empfohlene Schritte
1. Alte Version deinstallieren
2. Neue Version installieren
3. Browser-Cache leeren (empfohlen)
4. BrickMerge-Seite neu laden

---

## Bekannte Limitationen

### Aktuelle Version 2.1.0
- **CORS-Beschränkungen**: SmythsToys-Anfragen können durch Browser-Policies blockiert werden
- **Seitenstruktur-Abhängigkeit**: Bei größeren Website-Änderungen können Anpassungen nötig sein
- **Performance**: Externe Anfragen können Seitenladezeit beeinflussen

### Zukünftige Verbesserungen
- Caching-Mechanismus für SmythsToys-Anfragen
- Konfigurierbare Shop-IDs
- Weitere Preis-Vergleichsseiten
- Benutzereinstellungen für Dialog-Position und -Styling
