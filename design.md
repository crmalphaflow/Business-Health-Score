# Business Health Score App - Interface Design

## Design-Philosophie
Die App folgt den Apple Human Interface Guidelines und orientiert sich an modernen iOS-Business-Apps wie QuickBooks, Shopify Mobile und HubSpot. Das Design ist klar, datenorientiert und nutzt Visualisierungen, um komplexe Geschäftskennzahlen verständlich zu machen.

## Farbschema
- **Primary (Accent)**: `#0066CC` (Vertrauenswürdiges Blau für Business-Kontext)
- **Success**: `#22C55E` (Grün für positive Werte)
- **Warning**: `#F59E0B` (Orange für Warnungen)
- **Error**: `#EF4444` (Rot für kritische Bereiche)
- **Background**: `#FFFFFF` (Light) / `#151718` (Dark)
- **Surface**: `#F5F5F5` (Light) / `#1E2022` (Dark)
- **Foreground**: `#11181C` (Light) / `#ECEDEE` (Dark)

## Screen-Struktur

### 1. Home Screen (Dashboard)
**Hauptfunktion**: Übersicht über den aktuellen Business Health Score und die wichtigsten Metriken.

**Layout (Portrait 9:16)**:
- **Header-Bereich** (oben):
  - App-Logo (links)
  - Titel "Business Health Score"
  - Einstellungs-Icon (rechts)
  
- **Score-Card** (prominent, oberer Bereich):
  - Großer kreisförmiger Progress-Indikator (500-Punkte-Skala)
  - Zentrale Punktzahl (z.B. "267/500")
  - Prozentanzeige (z.B. "53% Effizienz")
  - Farbcodierung: Rot (<60%), Orange (60-79%), Grün (80%+)
  
- **Key Metrics Cards** (scrollbar):
  - "Annual Revenue Loss" Card:
    - Icon (Geld-Symbol)
    - Betrag in großer Schrift (z.B. "$342,800")
    - Label "Jährlicher Umsatzverlust"
  - "Daily Opportunity Cost" Card:
    - Icon (Kalender/Uhr)
    - Betrag (z.B. "$939/Tag")
    - Label "Tägliche Opportunitätskosten"
  
- **5 Säulen Übersicht** (Kompakte Liste):
  - Jede Säule als horizontale Card:
    - Säulen-Name (z.B. "Datenbank")
    - Punktzahl (z.B. "52/100")
    - Mini-Progress-Bar
    - Chevron-Right Icon für Details
  
- **CTA Button** (unten, sticky):
  - "Neue Analyse starten" (Primary Button)

**User Flow**:
1. User öffnet App → sieht letzten gespeicherten Score
2. Tap auf Säule → navigiert zu Säulen-Detail
3. Tap auf "Neue Analyse" → navigiert zu Input Screen

---

### 2. Input Screen (Dateneingabe)
**Hauptfunktion**: Erfassung aller notwendigen Geschäftsdaten für die Berechnung.

**Layout**:
- **Header**:
  - Zurück-Button (links)
  - Titel "Geschäftsdaten eingeben"
  - Fortschrittsanzeige (z.B. "Schritt 1 von 5")
  
- **Formular-Bereiche** (ScrollView, gruppiert nach Säulen):
  
  **Säule 1: Datenbank**
  - Input: "Gesamtzahl Kunden" (Number Input)
  - Input: "Durchschnittlicher Projektwert ($)" (Number Input mit Currency-Format)
  - Input: "Kontaktfrequenz pro Jahr" (Number Input)
  
  **Säule 2: Reputation**
  - Input: "Google-Sternebewertung" (Number Input, 1-5, Dezimal)
  - Input: "Antwortrate auf Bewertungen (%)" (Number Input, 0-100)
  
  **Säule 3: Lead Capture**
  - Input: "Tägliche Anrufe" (Number Input)
  - Input: "Anrufannahmequote (%)" (Number Input, 0-100)
  
  **Säule 4: Omnichannel**
  - Multi-Select: Verfügbare Kanäle (Checkboxes):
    - Telefon
    - E-Mail
    - Live-Chat
    - Social Media
    - SMS
  
  **Säule 5: Website**
  - Input: "Monatliche Website-Besucher" (Number Input)
  - Input: "Konversionsrate (%)" (Number Input, 0-100, Dezimal)
  - Input: "Website-Ladezeit (Sekunden)" (Number Input, Dezimal)
  
- **Action Buttons** (unten, sticky):
  - "Abbrechen" (Secondary Button)
  - "Berechnen" (Primary Button, disabled bis alle Pflichtfelder ausgefüllt)

**User Flow**:
1. User füllt Formular aus (alle Felder erforderlich)
2. Tap auf "Berechnen" → App berechnet Score
3. Navigation zu Results Screen

---

### 3. Results Screen (Ergebnisse)
**Hauptfunktion**: Detaillierte Darstellung des berechneten Business Health Score mit Breakdown.

**Layout**:
- **Header**:
  - Zurück-Button (links)
  - Titel "Ihre Ergebnisse"
  - Teilen-Icon (rechts)
  
- **Score-Übersicht** (oben):
  - Großer Score-Circle (wie Home, aber animiert beim Laden)
  - Punktzahl + Prozent
  - Status-Badge (z.B. "Optimierungsbedarf" in Orange)
  
- **Revenue Impact Section**:
  - Card: "Jährlicher Umsatzverlust"
    - Großer Betrag
    - Breakdown-Button ("Details anzeigen")
  - Card: "Tägliche Kosten"
    - Betrag mit Countdown-Animation
  
- **5 Säulen Breakdown** (Expandable Cards):
  - Jede Säule als Card:
    - Name + Punktzahl + Progress Bar
    - Tap zum Expandieren:
      - Detaillierte Metriken
      - Umsatz-Impact für diese Säule
      - Verbesserungsvorschläge (Text)
  
- **Action Buttons** (unten):
  - "Ergebnisse speichern" (Primary)
  - "Neue Analyse" (Secondary)

**User Flow**:
1. User sieht animierte Ergebnisse
2. Tap auf Säule → expandiert Details
3. Tap auf "Speichern" → speichert in Historie (AsyncStorage)
4. Tap auf "Neue Analyse" → zurück zu Input Screen

---

### 4. Pillar Detail Screen (Säulen-Details)
**Hauptfunktion**: Tiefere Einblicke in eine spezifische Säule mit Verbesserungsvorschlägen.

**Layout**:
- **Header**:
  - Zurück-Button
  - Säulen-Name (z.B. "Datenbank")
  
- **Score Section**:
  - Punktzahl (groß)
  - Progress Bar
  - Benchmark-Vergleich (z.B. "Branchendurchschnitt: 78/100")
  
- **Metriken-Cards**:
  - Eingegebene Werte anzeigen
  - Benchmark-Werte daneben
  - Differenz hervorheben
  
- **Revenue Impact**:
  - Umsatzverlust für diese Säule
  - Formel-Erklärung (kollabierbar)
  
- **Empfehlungen** (Liste):
  - Konkrete Handlungsempfehlungen
  - Priorität (Hoch/Mittel/Niedrig)
  
- **CTA Button**:
  - "Daten aktualisieren" → zurück zu Input Screen (vorausgefüllt)

---

### 5. History Screen (Verlauf)
**Hauptfunktion**: Übersicht über vergangene Analysen und Trend-Entwicklung.

**Layout**:
- **Header**:
  - Titel "Verlauf"
  
- **Trend-Chart** (oben):
  - Linien-Diagramm: Score-Entwicklung über Zeit
  - X-Achse: Datum
  - Y-Achse: Punktzahl (0-500)
  
- **Historie-Liste** (scrollbar):
  - Jede Analyse als Card:
    - Datum + Uhrzeit
    - Score (Punkte + Prozent)
    - Trend-Icon (↑↓→)
    - Tap → lädt diese Analyse in Results Screen

**User Flow**:
1. User sieht alle gespeicherten Analysen
2. Tap auf Eintrag → zeigt Details dieser Analyse
3. Swipe-to-Delete für alte Einträge

---

### 6. Settings Screen (Einstellungen)
**Hauptfunktion**: App-Konfiguration und Informationen.

**Layout**:
- **Header**:
  - Zurück-Button
  - Titel "Einstellungen"
  
- **Einstellungs-Gruppen**:
  
  **Präferenzen**:
  - Währung (Dropdown: $, €, £, etc.)
  - Sprache (Dropdown: Deutsch, English)
  - Theme (Toggle: Light/Dark/Auto)
  
  **Benchmarks** (Fortgeschritten):
  - Anpassbare Benchmark-Werte für jede Säule
  - Reset auf Standard-Button
  
  **Daten**:
  - "Verlauf löschen" (Destructive Button)
  - "Daten exportieren" (CSV-Export)
  
  **Info**:
  - App-Version
  - "Über die App" (Text-Screen)
  - "Datenschutz" (Text-Screen)

---

## Key User Flows

### Flow 1: Erste Analyse
1. App öffnen → Home Screen (leer, nur CTA)
2. Tap "Neue Analyse starten" → Input Screen
3. Daten eingeben → Tap "Berechnen"
4. Results Screen → Ergebnisse ansehen
5. Tap "Speichern" → zurück zu Home (jetzt mit Daten)

### Flow 2: Säulen-Optimierung
1. Home Screen → Tap auf Säule mit niedrigem Score
2. Pillar Detail Screen → Empfehlungen lesen
3. Tap "Daten aktualisieren" → Input Screen (vorausgefüllt)
4. Werte anpassen → Tap "Berechnen"
5. Results Screen → Vergleich mit vorheriger Analyse

### Flow 3: Trend-Analyse
1. Home Screen → Tap auf History-Tab
2. History Screen → Trend-Chart ansehen
3. Tap auf alten Eintrag → Results Screen (historisch)
4. Vergleich mit aktuellem Score

---

## Komponenten-Bibliothek

### Wiederverwendbare Komponenten:
1. **ScoreCircle**: Kreisförmiger Progress-Indikator mit Punktzahl
2. **MetricCard**: Card für einzelne Metriken (Icon, Wert, Label)
3. **PillarCard**: Horizontale Card für Säulen-Übersicht
4. **InputField**: Styled TextInput mit Label und Validierung
5. **ProgressBar**: Horizontale Progress-Bar mit Farbcodierung
6. **PrimaryButton**: Hauptaktions-Button (Primary-Farbe)
7. **SecondaryButton**: Sekundärer Button (Outline-Style)
8. **ExpandableCard**: Card mit Expand/Collapse-Funktion

---

## Interaktions-Design

### Animationen:
- Score-Circle: Animierter Fill beim Laden (0 → Zielwert, 1.5s)
- Progress-Bars: Animierter Fill (0 → Zielwert, 1s)
- Card-Expansion: Smooth Height-Animation (300ms)
- Screen-Transitions: Native Stack-Animation (iOS-Standard)

### Haptics:
- Button-Tap: Light Impact
- Score-Berechnung abgeschlossen: Success Notification
- Validierungs-Fehler: Error Notification

### Feedback:
- Button-Press: Scale 0.97 + Opacity 0.9
- Input-Focus: Border-Color-Change + Light Haptic
- Loading: Spinner + "Berechne Score..." Text

---

## Tab-Navigation

**Tab Bar** (unten):
1. **Home** (house.fill Icon)
2. **History** (clock.fill Icon)
3. **Settings** (gear Icon)

---

## Daten-Persistenz

**AsyncStorage** (lokal):
- Letzte Analyse-Ergebnisse
- Verlauf (Array von Analysen)
- User-Einstellungen (Währung, Theme, etc.)
- Custom Benchmark-Werte

**Keine Backend-Anbindung erforderlich** (rein lokale App).

---

## Accessibility

- Alle Inputs mit Labels
- Ausreichende Touch-Targets (min. 44x44pt)
- Farbkontraste WCAG AA-konform
- VoiceOver-Support für alle Elemente
- Dynamic Type Support für Text-Skalierung

---

## Technische Hinweise

- **Berechnungen**: Alle Formeln in separater `calculations.ts` Utility-Datei
- **Validierung**: Zod-Schemas für Input-Validierung
- **State Management**: React Context für globale Daten (aktuelle Analyse, Settings)
- **Charts**: React Native SVG für einfache Charts (Trend-Linie)
- **Formatierung**: Intl.NumberFormat für Währungs- und Prozent-Formatierung
