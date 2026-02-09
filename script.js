document.addEventListener('DOMContentLoaded', function () {
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const maxWidth = 768;

    if (!isMobileUserAgent && (window.innerWidth > maxWidth || window.innerHeight > maxWidth)) {
        ons.notification.alert({
            message: 'Diese Anwendung ist primär für mobile Geräte optimiert. Die Darstellung auf Desktop-Geräten kann abweichen.',
            title: 'Hinweis'
        });
    }
});

function zeigeThema(thema) {
    const navigator = document.getElementById('nvg');
    navigator.pushPage('unterthemen-seite.html', {
        data: { thema }
    });
}

document.addEventListener('init', function (event) {
    const page = event.target;

    if (page.id === "unterthemen-seite") {
        const thema = page.data.thema;
        page.querySelector('#themen').textContent = thema;

        const liste = page.querySelector('#unterthemenListe');
        liste.innerHTML = '';

        daten[thema].forEach(unterthema => {
            let item = document.createElement('ons-list-item');
            item.setAttribute('tappable', '');
            item.textContent = unterthema;
            item.onclick = () => zeigeUnterthemaDetail(unterthema);
            liste.appendChild(item);
        });
    }
});

function zeigeUnterthemaDetail(unterthema) {
    document.getElementById('nvg').pushPage('kartenAnzeigen.html', {
        data: { unterthema }
    });
}

// Service Worker registrieren
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log("Service Worker registriert!");
    }).catch(err => {
        console.log("Service Worker Fehler:", err);
    });
}

let db;

// IndexedDB öffnen mit objectStore
const request = indexedDB.open("TextSpeicher", 1);
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("texte")) {
        db.createObjectStore("texte", { autoIncrement: true });
    }
};
request.onsuccess = function (event) {
    db = event.target.result;
    zeigeTexte();
};
request.onerror = function (event) {
    console.error("Fehler beim Öffnen der DB:", event);
};

// Texte speichern
function speichern() {
    const text = document.getElementById("textInput").value;
    const tx = db.transaction("texte", "readwrite");
    const store = tx.objectStore("texte");
    store.add(text);
    tx.oncomplete = () => {
        document.getElementById("textInput").value = "";
        zeigeTexte();
    };
}

// Texte anzeigen
function zeigeTexte() {
    const tx = db.transaction("texte", "readonly");
    const store = tx.objectStore("texte");
    const request = store.getAll();

    request.onsuccess = () => {
        const container = document.getElementById("ausgabe");
        container.innerHTML = ""; // vorherige Einträge löschen
        request.result.reverse().forEach(text => {
            const p = document.createElement("p");
            p.textContent = text;
            container.appendChild(p);
        });
    };
}

// Lokaler Speicher-Schlüssel
const kartenKey = "karteikarten";

function karteikarteSpeichern() {
    const ueberschrift = document.getElementById('eingabe-ueberschrift').value.trim();
    const thema = document.getElementById("unterthemaAuswahl").value.trim();
    const frage = document.getElementById("frageInput").value.trim();
    const antwort = document.getElementById("antwortInput").value.trim();

    if (!thema || !frage || !antwort || !ueberschrift) {
        ons.notification.alert("Bitte alles ausfüllen.");
        return;
    }

    const neueKarte = {
        frage,
        antwort,
        ueberschrift,
        datum: new Date().toISOString()
    };

    let daten = JSON.parse(localStorage.getItem(kartenKey)) || {};
    if (!daten[thema]) daten[thema] = [];

    daten[thema].push(neueKarte);
    localStorage.setItem(kartenKey, JSON.stringify(daten));

    ons.notification.toast("Karteikarte gespeichert!", { timeout: 2000 });

    document.getElementById("eingabe-ueberschrift").value = "";
    document.getElementById("frageInput").value = "";
    document.getElementById("antwortInput").value = "";
}

document.addEventListener("init", function (event) {
    if (event.target.id === "karteikartenSeite") {
        console.log("KarteikartenSeite wird geladen");

        const select = event.target.querySelector("#unterthemaAuswahl");
        select.innerHTML = '<option value="">Unterthema wählen</option>';

        for (let haupt in daten) {
            daten[haupt].forEach(ut => {
                const opt = document.createElement("option");
                opt.value = ut;
                opt.textContent = ut;
                select.appendChild(opt);
            });
        }
    }
});


function zeigeKarten(unterthema) {
    const navigator = document.getElementById("nvg");
    navigator.pushPage("kartenAnzeigen.html", {
        data: { unterthema }
    });
}

function zeigeKarteikartenSeite() {
    document.getElementById("nvg").pushPage("seite4.html");
}

document.addEventListener("init", function (event) {
    if (event.target.id === "kartenAnzeigeSeite") {
        const unterthema = event.target.data.unterthema;
        document.getElementById("anzeigeTitel").innerText = unterthema;

        const container = document.getElementById("kartenListe");
        container.innerHTML = "";

        const daten = JSON.parse(localStorage.getItem(kartenKey)) || {};
        const karten = daten[unterthema] || [];

        if (karten.length === 0) {
            container.innerHTML = "<p style='text-align:center;'>Keine Karteikarten vorhanden.</p>";
        } else {
            karten.forEach((k, i) => {
                const flipCard = document.createElement("div");
                flipCard.classList.add("flip-card");

                const flipCardInner = document.createElement("div");
                flipCardInner.classList.add("flip-card-inner");

                const flipCardFront = document.createElement("div");
                flipCardFront.classList.add("flip-card-front");
                flipCardFront.innerHTML = `<div class="title">${k.ueberschrift}</div><div class="content"><b>Frage:</b> ${k.frage}</div>`;

                const flipCardBack = document.createElement("div");
                flipCardBack.classList.add("flip-card-back");
                flipCardBack.innerHTML = `<div class="title">${k.ueberschrift}</div><div class="content"><b>Antwort:</b> ${k.antwort}</div>`;

                flipCardInner.appendChild(flipCardFront);
                flipCardInner.appendChild(flipCardBack);
                flipCard.appendChild(flipCardInner);

                container.appendChild(flipCard);
            });
        }
    }
});

function exportiereKarteikarten() {
    const datenString = localStorage.getItem(kartenKey);
    if (!datenString) {
        ons.notification.alert("Keine Karteikarten zum Exportieren gefunden.");
        return;
    }

    try {
        const daten = JSON.parse(datenString);
        const schoenesJson = JSON.stringify(daten, null, 2);
        const blob = new Blob([schoenesJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "karteikarten_export.json";
        link.click();

        URL.revokeObjectURL(url);

    } catch (error) {
        ons.notification.alert("Fehler beim Verarbeiten der Daten für den Export.");
        console.error("Export-Fehler:", error);
    }
}

function importiereKarteikarten() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = event => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = e => {
                try {
                    const importierteDaten = JSON.parse(e.target.result);
                    localStorage.setItem(kartenKey, JSON.stringify(importierteDaten));
                    ons.notification.toast("Karteikarten importiert!", { timeout: 2000 });
                    // Optional: Hier könntest du die angezeigten Karteikarten aktualisieren,
                    // falls du die Karten direkt nach dem Import anzeigen solltest.
                    console.log("Karteikarten importiert:", importierteDaten);
                } catch (error) {
                    ons.notification.alert("Fehler beim Lesen der Datei oder ungültiges JSON-Format.");
                    console.error("Import-Fehler:", error);
                }
            };

            reader.onerror = () => {
                ons.notification.alert("Fehler beim Lesen der Datei.");
            };

            reader.readAsText(file);
        }
    };

    input.click(); // Simuliert einen Klick auf das unsichtbare Input-Element
}

function zeigeKarteikartenKurz(kartenArray) {
    const alleKartenListe = document.getElementById('alleKartenListe');
    alleKartenListe.innerHTML = ''; // Leere die Liste

    if (kartenArray.length === 0) {
        const listItem = document.createElement('ons-list-item');
        listItem.textContent = 'Keine Karteikarten gefunden.';
        alleKartenListe.appendChild(listItem);
        return;
    }

    kartenArray.forEach(karte => {
        const listItem = document.createElement('ons-list-item');
        listItem.textContent = karte.ueberschrift;
        listItem.setAttribute('tappable', ''); // Macht das Listenelement klickbar
        listItem.addEventListener('click', () => zeigeKarteikartenDetails(karte));
        alleKartenListe.appendChild(listItem);
    });
}

function zeigeAlleKarteikarten() {
    const kartenDaten = JSON.parse(localStorage.getItem(kartenKey)) || {};
    let alleKartenArray = [];
    for (const thema in kartenDaten) {
        if (kartenDaten.hasOwnProperty(thema)) {
            alleKartenArray = alleKartenArray.concat(kartenDaten[thema]);
        }
    }
    zeigeKarteikartenKurz(alleKartenArray);
}

function sucheKarteikarten(suchBegriff) {
    const kartenDaten = JSON.parse(localStorage.getItem(kartenKey)) || {};
    const suchBegriffLower = suchBegriff.toLowerCase();
    let gefundeneKarten = [];

    for (const thema in kartenDaten) {
        if (kartenDaten.hasOwnProperty(thema)) {
            kartenDaten[thema].forEach(karte => {
                if (
                    karte.frage.toLowerCase().includes(suchBegriffLower) ||
                    karte.antwort.toLowerCase().includes(suchBegriffLower) ||
                    karte.ueberschrift.toLowerCase().includes(suchBegriffLower)
                ) {
                    gefundeneKarten.push(karte);
                }
            });
        }
    }

    zeigeKarteikartenKurz(gefundeneKarten);

    // Wenn das Suchfeld leer ist, zeige alle Karten wieder an
    if (!suchBegriff) {
        zeigeAlleKarteikarten();
    }
}

// Globale Variable, um die aktuell angezeigte Karteikarte zu speichern
let aktuelleKarteZumLoeschen = null;

function zeigeKarteikartenDetails(karte) {
    const kartenDaten = JSON.parse(localStorage.getItem(kartenKey)) || {};
    let themaDerKarte = null;
    let indexDerKarte = -1;

    // Finde das Thema und den Index der angeklickten Karte
    for (const thema in kartenDaten) {
        if (kartenDaten.hasOwnProperty(thema)) {
            const index = kartenDaten[thema].findIndex(k => k.datum === karte.datum);
            if (index !== -1) {
                themaDerKarte = thema;
                indexDerKarte = index;
                break;
            }
        }
    }

    document.getElementById('dialogTitel').textContent = karte.ueberschrift;
    document.getElementById('dialogFrage').textContent = karte.frage;
    document.getElementById('dialogAntwort').textContent = karte.antwort;
    document.getElementById('dialogDatum').textContent = new Date(karte.datum).toLocaleDateString() + ' ' + new Date(karte.datum).toLocaleTimeString();
    document.getElementById('dialogThema').value = themaDerKarte;
    document.getElementById('dialogIndex').value = indexDerKarte;
    aktuelleKarteZumLoeschen = karte; // Speichere die Karte für die Löschfunktion
    document.getElementById('karteikartenDialog').show();
}

function loescheKarteikarte() {
    document.getElementById('karteikartenDialog').hide();
    document.getElementById('confirmDialog').show();
}

function bestaetigeLoeschen() {
    document.getElementById('confirmDialog').hide();

    if (aktuelleKarteZumLoeschen) {
        const thema = document.getElementById('dialogThema').value;
        const index = parseInt(document.getElementById('dialogIndex').value);

        let kartenDaten = JSON.parse(localStorage.getItem(kartenKey)) || {};

        if (kartenDaten[thema] && index !== -1) {
            kartenDaten[thema].splice(index, 1); // Entferne die Karte aus dem Array

            // Wenn das Thema jetzt leer ist, lösche es aus dem Objekt
            if (kartenDaten[thema].length === 0) {
                delete kartenDaten[thema];
            }

            localStorage.setItem(kartenKey, JSON.stringify(kartenDaten));
            ons.notification.toast("Karteikarte gelöscht!", { timeout: 2000 });

            // Aktualisiere die Liste der angezeigten Karten
            zeigeAlleKarteikarten();
        }

        aktuelleKarteZumLoeschen = null; // Zurücksetzen
    }
}

// Event Listener, um die Liste aller Karten anzuzeigen, wenn die Seite geladen wird
document.addEventListener('show', (event) => {
    if (event.target.id === 'settingsPage') {
        zeigeAlleKarteikarten();
    }
});

function alleDatenLöschen() {
    ons.notification.confirm({
        message: 'Möchtest du wirklich alle deine gespeicherten Karteikarten löschen? Bitte exportiere sie vorher, wenn du sie behalten möchtest.',
        title: 'Daten löschen bestätigen',
        buttonLabels: ['Abbrechen', 'Ja, löschen'],
        primaryButtonIndex: 1,
        callback: function (index) {
            if (index === 1) { // Wenn der Benutzer "Ja, löschen" klickt
                localStorage.clear();
                ons.notification.alert({
                    message: 'Alle Karteikarten wurden gelöscht.',
                    title: 'Daten gelöscht'
                });
                // Optional: Seite neu laden, um die Änderungen widerzuspiegeln
                // window.location.reload();
            }
        }
    });
}