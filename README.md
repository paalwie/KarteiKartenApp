# KarteiKartenApp

Eine Progressive Web App (PWA) zum Erstellen, Verwalten und Lernen mit digitalen Karteikarten, speziell entwickelt für mobile Geräte. <br>
Link: https://karteikartenapp.netlify.app

## 📱 Über die App

Die KarteiKartenApp ist eine browserbasierte Anwendung, die es ermöglicht, Karteikarten zu verschiedenen Themen zu erstellen und zu organisieren. Die App funktioniert offline und kann auf dem Smartphone wie eine native App installiert werden.

## ✨ Features

- **Karteikarten erstellen**: Erstellen Sie Karteikarten mit Überschrift, Frage und Antwort
- **Thematische Organisation**: Ordnen Sie Ihre Karten nach Hauptthemen und Unterthemen
- **Flip-Card-Design**: Interaktive Karten mit Vorder- und Rückseite zum Lernen
- **Suchfunktion**: Durchsuchen Sie alle Karteikarten nach Stichworten
- **Import/Export**: Sichern und teilen Sie Ihre Karteikarten als JSON-Datei
- **Offline-Funktionalität**: Arbeiten Sie auch ohne Internetverbindung
- **PWA-Support**: Installierbar auf dem Homescreen von Smartphones

## 🛠️ Verwendete Technologien

- **Frontend-Framework**: [Onsen UI](https://onsen.io/) - Mobile-First UI-Framework
- **Datenspeicherung**: 
  - LocalStorage für Karteikarten
  - IndexedDB für erweiterte Datenverwaltung
- **PWA-Technologien**:
  - Service Worker für Offline-Funktionalität
  - Web App Manifest für Installation
- **Vanilla JavaScript**: Keine zusätzlichen Build-Tools erforderlich

## 📋 Vorkonfigurierte Themen

Die App enthält vordefinierte Themenbereiche aus der IT-Ausbildung:

- Informieren und Beraten von Kunden
- Entwickeln, Erstellen und Betreuen von IT-Lösungen
- Durchführen und Dokumentieren von qualitätssichernden Maßnahmen
- IT-Sicherheit und Datenschutz
- Betreiben von IT-Systemen
- Inbetriebnehmen von Speicherlösungen
- Programmieren von Softwarelösungen
- Konzipieren und Umsetzen von kundenspezifischen Softwareanwendungen
- Sicherstellen der Qualität von Softwareanwendungen
- Berufsausbildung sowie Arbeits- und Tarifrecht
- Aufbau und Organisation des Ausbildungsbetriebes
- Sicherheit und Gesundheitsschutz bei der Arbeit
- Umweltschutz
- Vernetztes Zusammenarbeiten unter Nutzung digitaler Medien

## 🚀 Installation & Nutzung

### Als Webseite nutzen

1. Klonen Sie das Repository:
```bash
git clone [repository-url]
cd KarteiKartenApp
```

2. Starten Sie einen lokalen Webserver (z.B. mit Python):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

3. Öffnen Sie `http://localhost:8000` in Ihrem Browser

### Als PWA installieren

1. Öffnen Sie die App in einem unterstützten Browser (Chrome, Edge, Safari)
2. Klicken Sie auf "Zur Startseite hinzufügen" / "Installieren"
3. Die App wird wie eine native App auf Ihrem Gerät installiert

## 📖 Bedienung

### Karteikarte erstellen

1. Navigieren Sie zur Seite "Karteikarte erstellen"
2. Wählen Sie ein Unterthema aus der Dropdown-Liste
3. Geben Sie Überschrift, Frage und Antwort ein
4. Klicken Sie auf "Speichern"

### Karteikarten anzeigen

1. Wählen Sie auf der Startseite ein Hauptthema
2. Wählen Sie ein Unterthema aus der Liste
3. Die Karteikarten werden als interaktive Flip-Cards angezeigt
4. Klicken Sie auf eine Karte, um die Antwort zu sehen

### Karteikarten verwalten

- **Suchen**: Nutzen Sie die Suchfunktion in den Einstellungen
- **Löschen**: Klicken Sie auf eine Karte in der Übersicht und dann auf "Löschen"
- **Exportieren**: Sichern Sie alle Karten als JSON-Datei
- **Importieren**: Laden Sie zuvor exportierte JSON-Dateien

## 📁 Projektstruktur

```
KarteiKartenApp/
├── index.html              # Haupt-HTML-Datei mit allen Seiten
├── script.js               # Hauptlogik der Anwendung
├── themen.js              # Vordefinierte Themen und Unterthemen
├── onsenui_min.js         # Onsen UI Framework (lokal)
├── sw.js                  # Service Worker für Offline-Funktionalität
├── manifest.json          # PWA Manifest
└── icon.png              # App-Icon
```

## 💾 Datenspeicherung

Alle Karteikarten werden lokal im Browser gespeichert:

- **LocalStorage**: Hauptspeicher für Karteikarten (Schlüssel: `karteikarten`)
- **IndexedDB**: Für zusätzliche Textdaten (experimentell)

**Wichtig**: Die Daten bleiben nur auf Ihrem Gerät gespeichert. Nutzen Sie die Export-Funktion, um Ihre Daten zu sichern!

## 🔒 Datenschutz

- Alle Daten werden ausschließlich lokal auf Ihrem Gerät gespeichert
- Keine Übertragung an externe Server
- Keine Tracking- oder Analyse-Tools

## 🔧 Anpassung

### Eigene Themen hinzufügen

Bearbeiten Sie die Datei `themen.js` und fügen Sie neue Hauptthemen und Unterthemen hinzu:

```javascript
const daten = {
    "Neues Hauptthema": [
        "Unterthema 1",
        "Unterthema 2"
    ]
};
```

### Design anpassen

Das Design basiert auf Onsen UI und kann über CSS-Variablen in der `index.html` angepasst werden.

## 📱 Browser-Kompatibilität

- Chrome/Edge (empfohlen)
- Firefox
- Safari (iOS)
- Opera

**Hinweis**: Die App ist primär für mobile Geräte optimiert. Auf Desktop-Geräten wird eine entsprechende Meldung angezeigt.

## 🐛 Bekannte Einschränkungen

- Die App zeigt beim ersten Laden auf Desktop-Geräten einen Hinweis an
- Service Worker muss bei Updates manuell aktualisiert werden (CACHE_NAME ändern)
- LocalStorage-Größenbeschränkungen je nach Browser (~5-10 MB)

## 📝 Lizenz

[Fügen Sie hier Ihre Lizenzinformationen ein]

## 👤 Autor

[Fügen Sie hier Ihre Informationen ein]

## 🤝 Beitragen

Contributions, Issues und Feature-Requests sind willkommen!

## 📞 Support

Bei Problemen oder Fragen erstellen Sie bitte ein Issue im Repository.

---

**Viel Erfolg beim Lernen! 📚**
