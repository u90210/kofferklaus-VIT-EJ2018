/*---------------------------------------------------------------------------------*/
// Variablendeklaration
const modulnummer_inp = document.getElementById("modulnummer");
const kennziffer_inp = document.getElementById("kennziffer");
const hochgeladeneDateien_inp = document.getElementById("hochgeladeneDateien");
const radio_btn = document.querySelector('input[type="radio"]');
const optZip_rad = document.getElementById("zip");
const optHash_rad = document.getElementById("hashen");
const optZipHash_rad = document.getElementById("ziphash");
const absenden_btn = document.getElementById("absenden");
const counter_btn = document.getElementById("counterStart");
const anzahl_dspl = document.getElementById("anzahl");
const list_dspl = document.getElementById('list');
const name_dspl = document.getElementById('name');
const txt_dspl = document.getElementById('txt');
const prename_dspl = document.getElementById('vorname');
const postname_dspl = document.getElementById('nachname');
const change_dspl = document.getElementById('change');
const progress = document.getElementById("progress");
const dragArea = document.getElementById('drag_upload_file');
const dropZone = document.querySelectorAll("#drop_file_zone");
const drop = document.getElementById('drop_file_zone');
/*---------------------------------------------------------------------------------*/
/* Funktion, die unterschiedliche Textelemente aktiviert, sobald Inhalte hochgeladen werden.
Textelemente sind abhängig von Wahl des RadioButtons.

Aufruf als dZ.addEventListener("drop").

Aufruf von displayFileAttr().
*/
function init(fileList) {
    displayFileAttr(fileList);
    toggleRadB;

    document.getElementById("testtest").style.display = "block"
}

/* Hauptfunktion, die alle weiteren Funktionen startet.
    - 'Dateien zippen' ausgewählt: 
        - Dokument(e) vom Input-Feld entgegennehmen 
        - Zusammenführung (unter dem Namen der Kennziffer) 
        - ZIP-Archiv Generierung 
        - Download
    - 'Dateien hashen' ausgewählt: 
        - Dokument(e) vom Input-Feld entgegennehmen 
        - Generierung des Hash-Wertes 
        - Download
       -> BEHOBEN: mögliche Dateiformate in dieser Option waren zunächst eingeschränkt auf 'application.*' (weil die Methode auf kleineren Formaten Hash-Werte nicht zuverlässig generierte)
    - 'Die Dateien zippen und dann hashen' ausgewählt: 
        - Dokument(e) vom Input-Feld entgegennehmen 
        - Zusammenführung (unter dem Namen der Kennziffer)
        - ZIP-Archiv Generierung 
        - Generierung des Hash-Wertes 
        - Downloads: Zip-Archiv und TXT

Aufruf als addEventListener auf absenden_btn.

Aufruf von makeZip().
Aufruf von printInfo():
Aufruf von removeAllChildNodes().
Aufruf von generateHash().
Aufruf von generateHashOnZip().
*/
function main() {
    const fileList = hochgeladeneDateien_inp.files;
    var len = fileList.length;

    // Neues Zip Objekt
    var zip = new JSZip()
        // Alle ausgewählten Dokumente dem Zip-Archiv hinzufügen.
    for (let f of fileList) {
        var filename = f.name
        zip.file(filename, f);
        //console.log("zip is instance of JSZip? | Inner Loop", zip instanceof JSZip)  //true 
    }

    if (optZip_rad.checked) { // Wenn RadioButton Zippen ausgewählt...
        makeZip(zip);
        // Change innerHTML
        change_dspl.innerHTML = "Folgende Dokumente wurden einem ZIP-Archiv hinzugefügt: ";
        anzahl_dspl.innerHTML = "Anzahl der gezippten Elemente: " + len + '<br><br>';
    } else if (optHash_rad.checked) { // Wenn RadioButton Hashen ausgewählt...
        parent = list_dspl
        removeAllChildNodes(parent)
        parent = name_dspl
        removeAllChildNodes(parent)
        generateHash();
        // Change innerHTML
        change_dspl.innerHTML = "Für folgende Dokumente wurden Hash-Werte generiert: ";
        anzahl_dspl.innerHTML = "Anzahl gehashter Dokumente: " + len + '<br><br>';
    } else if (optZipHash_rad.checked) { // Wenn RadioButton Zippen + Hashen ausgewählt...
        parent = list_dspl
        removeAllChildNodes(parent)
        parent = name_dspl
        removeAllChildNodes(parent)

        generateHashOnZip(zip);

        // Change innerHTML
        change_dspl.innerHTML = "Folgende Dokumente befinden sich im erstellten ZIP-Archiv: ";
        anzahl_dspl.innerHTML = "Anzahl der Elemente im ZIP-Archiv: " + len + '<br><br>';
        for (let f of fileList) {
            printInfo(f);
        }
    }
}

/* Funktion, die ein Zip-Archiv generiert und dessen Download als Object URl im Feld name_dspl bereitstellt.

Aufruf aus main().
*/
function makeZip(zip) {
    // Name zum speichern des ZIP-Archivs
    let name = kennziffer_inp.value + '.zip'
        // ZIP-Archiv asynchron generieren
    zip.generateAsync({ type: "blob" }, function updateCallback(metadata) {
            // Progressbar
            var width = 1;
            if (width <= 100) {
                width++;
                progress.style.width = Math.round(metadata.percent) + '%';
                progress.innerHTML = Math.round(metadata.percent) + '%';
            }
        })
        .then(function(content) {
            //saveAs(content, name)
            // Verlinkung des ZIP-Archivs mit innerHTML-Element
            anchor_zip = `<a href="${window.URL.createObjectURL(content)}" download="${name}">${name}</a>`;

            if (optZip_rad.checked) {
                name_dspl.innerHTML = "<p style='font-size:14pt; font-weight: bold; border:3px; border-style:solid; border-color:#0055A5; padding: 1em; box-shadow: 10px 5px 5px #0d6efd;'>Generiertes ZIP-Archiv: " + anchor_zip + "</p>";
            }
            return anchor_zip;

        }).catch(err => { // Fehlerbehandlung
            console.log(err);
        });
}

/* Funktion,  die SHA256 über hochgeladene Dokumente errechnet
und eine Textdatei erzeugt. Um die list_dspl.innerHTML zu verändern und die TXT zu generieren wird die Hilfsfunktion printSaveHash(f, hashOrg, fname, output) aufgerufen.
 
Ausruf aus main().
 
Ausruf von printSaveHash().
Ausruf von arrayBufferToWordArray().
*/
function generateHash() {
    const fileList = hochgeladeneDateien_inp.files;
    output_sha = [];

    // Für jedes Dokument des Inputs..
    for (var i = 0; file = fileList[i]; i++) {
        var reader = new FileReader();

        // Schliesse Sha256 nachdem Dokument vollständig eingelesen wurde.
        reader.onloadend = (function(file) {
            return function(e) {
                var arrayBuffer = e.target.result;
                var filename = file.name;
                var hashOrg = CryptoJS.SHA256(arrayBufferToWordArray(arrayBuffer));
                // Alternativ: MD5
                //var hashOrg = CryptoJS.MD5(arrayBufferToWordArray(arrayBuffer));
                printSaveHash(file, hashOrg, filename, anchor_zip = '', anchor_sha = output_sha);
            };

        })(file); // Fehlerbehandlung 
        reader.onerror = function(e) {
            console.error(e);
        };
        // Lese Dokumente als ArrayBuffer ein.
        reader.readAsArrayBuffer(file);
    }
}

/* Funktion, die SHA256 über das ZIP-Archiv errechnet
und eine Textdatei erzeugt.
Um die list_dspl.innerHTML zu verändern und die TXT zu generieren wird die Hilfsfunktion printSaveHash(f, hashOrg, fname, output) aufgerufen.
 
Ausruf aus main().

Ausruf von printSaveHash().
*/
function generateHashOnZip(zip) {
    makeZip(zip);

    const fileList = hochgeladeneDateien_inp.files;
    var output_anch = []

    zip.generateAsync({ type: "blob" })
        .then(function(content) {
            var hash = CryptoJS.algo.SHA256.create();
            // Alternativ: MD5
            //var hash = CryptoJS.algo.MD5.create();

            var file = content;
            var start = 0;
            var stop = file.size - 1;

            var reader = new FileReader();
            // Onloadend: Check readyState.
            reader.onloadend = function(evt) {
                if (evt.target.readyState == FileReader.DONE) {
                    //**MAJOR PROBLEM: Behoben
                    // Since its binary data, the message needs to be converted from string to bytes using Latin1
                    // vgl. https://code.google.com/archive/p/crypto-js/issues/62
                    hash.update(CryptoJS.enc.Latin1.parse(evt.target.result));
                    var hashOrg = hash.finalize();
                    filename = kennziffer_inp.value + '.zip'
                    printSaveHash(file, hashOrg, filename, anchor_zip, output_anch);
                }
            };
            var blob = file.slice(start, stop + 1);
            //console.log("blob is instance of Blob?", blob instanceof Blob) //true
            // Lese Dokumente als Binärdaten ein.
            reader.readAsBinaryString(blob); //reader.readAsArrayBuffer(file); : würde hier nicht klappen!
        }).catch(err => { // Fehlerbehandlung
            console.log(err);
        });
}

/* Hilfsfunktion zur Formatierung der angezeigten Informationen über Dokument(e) in list_dspl.innerHTML.
        Für optZip_rad.checked:     Ausgabe von jedem Element, das dem ZIP-Archiv hinzugefügt wurde.
        Für optHash_rad.checked:    Ausgabe von allen Elementen, für welche eine Hash-Datei erzeugt wurde.
        Für optZipHash_rad.checked: siehe optZip_rad.checked

Aufruf aus main().
Aufruf aus displayFileAttr().
Aufruf aus printSaveHash().
Aufruf aus toggleRadB.
*/
function printInfo(f = '') {
    let output;
    date = new Date(f.lastModified);

    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();
    h = date.getHours()
    min = date.getMinutes()

    // Führende Nullen einfügen
    function padZero(number) {
        if (number < 10) { number = ("0" + number); }
        return number;
    }

    // Formatiere Datumsausgabe-String
    date = year + '-' + padZero(month) + '-' + padZero(dt) + '\t' + padZero(h) + ':' + padZero(min);

    // Formatiere KiB-Angabe
    function file_type() {
        if (f.type == 0) {
            output = ' (' + 'n/a) - ' + f.size + ' Bytes';
        } else {
            output = ' (' + f.type + ') ' + f.size + ' Bytes';
        }
        return output;
    }

    // DOM-Knoten erweitern (ohne 'Pfusch am Bau' zu betreiben)
    let ul = document.createElement("ul");
    list_dspl.appendChild(ul);
    let li = document.createElement("li");
    ul.appendChild(li);

    let strong = document.createElement("strong");
    li.appendChild(strong);

    output = f.name;

    let fileInfo_out = document.createTextNode(output);
    strong.appendChild(fileInfo_out);

    output = file_type();

    fileInfo_out = document.createTextNode(output);
    li.appendChild(fileInfo_out);

    let br = document.createElement("br");
    li.appendChild(br);

    output = '\t'

    fileInfo_out = document.createTextNode(output);
    li.appendChild(fileInfo_out);

    let small = document.createElement("small");
    li.appendChild(small);

    output = 'letztmalig modifiziert: \t' + date;

    fileInfo_out = document.createTextNode(output);
    small.appendChild(fileInfo_out);

    return li;
}

/* Hilfsfunktion zur Formatierung der angezeigten Informationen über Dokument(e) in list_dspl.innerHTML:
    Hinzufügen des Hash-Wertes.
        Für optHash_rad.checked:    Ausgabe des Hash-Wertes für alle Elementen, für welche eine Hash-Datei erzeugt wurde.
        Für optZipHash_rad.checked: Ausgabe des Hash-Wertes für das erstellte Zip-Archiv.
 
Aufruf aus printSaveHash().
*/
function printInfoWithSha(fnameSHA = '', hash = '', anch_zip = '', anch_sha = '') {

    function appendSha(ul) {
        let p = document.createElement("p");
        ul.appendChild(p);

        let strong = document.createElement("strong");
        ul.appendChild(strong);

        output = hash.slice(0, 10);

        fileInfo_out = document.createTextNode(output);
        strong.appendChild(fileInfo_out);

        output = " - " + hash.slice(10, -11) + " - ";

        fileInfo_out = document.createTextNode(output);
        ul.appendChild(fileInfo_out);

        strong = document.createElement("strong");
        ul.appendChild(strong);

        output = hash.slice(-10);

        fileInfo_out = document.createTextNode(output);
        strong.appendChild(fileInfo_out);
    };

    if (optHash_rad.checked) {
        let ul = document.createElement("ul");
        list_dspl.appendChild(ul);
        appendSha(ul);
        // Change innerHTML
        txt_dspl.innerHTML = "";
        name_dspl.innerHTML = "<p style='font-size:14pt; font-weight: bold; border:3px; border-style:solid; border-color:#0055A5; padding: 1em; box-shadow: 10px 5px 5px #0d6efd;'>TXT-Datei(en): " + anch_sha.join(' - ') + "</p>";
        // Alternativ: Rahmen "strahlend"
        // name_dspl.innerHTML = "<p style='font-size:14pt; style='border:3px; border-style:solid; border-color:#0055A5; padding: 1em; box-shadow: inset 0 0 1em #0d6efd, 0 0 1em #0d6efd;'>TXT-Datei(en): " + output_anch.join(' - ') + "</p>";
    } else if (optZipHash_rad.checked) {
        // Change innerHTML
        let p1 = document.createElement("p");
        name_dspl.appendChild(p1);

        p1.innerHTML = "Generiertes ZIP-Archiv: " + anch_zip;

        let ul = document.createElement("ul");
        p1.appendChild(ul);

        p1.style.fontSize = "14pt";
        p1.style.fontWeight = "bold";
        p1.style.border = "3px";
        p1.style.borderStyle = "solid";
        p1.style.borderColor = "#0055A5";
        p1.style.padding = "1em";
        p1.style.boxShadow = "10px 5px 5px #0d6efd";

        appendSha(ul)
        ul.style.fontSize = "10pt";
        ul.style.fontWeight = "normal";

        br = document.createElement("br");
        ul.appendChild(br);

        p2 = document.createElement("p");
        p1.appendChild(p2);
        p2.innerHTML = "TXT-Datei: " + anch_sha;

    }
}

/* Hilfsfunktion, die Hash-Werte ins Feld list_dspl.innerHTML überträgt und eine TXT über Dateinamen, Dateigröße und Prüfsumme generiert.
 
Aufruf aus generateHash().
Aufruf aus generateHashOnZip().
 
Aufruf von printInfo().
Aufruf von printInfoWithSha().
*/
function printSaveHash(f, hashOrg = '', fname, anchor_zip = '', anchor_sha = '') {
    // Endungen tilgen
    var re = fname.split(".")[0]
    var fnameSHA = fname.match(re);
    fnameSHA = fnameSHA + '.SHA256'

    // Format TXT Content
    hash = [hashOrg].join('')
    hash = hash.toUpperCase();

    s = f.size;
    if (s / 1024 < 1) {
        s = [s, ' Bytes'].join('');
    } else { // Wenn KiB > 1...
        s = [s, ' Bytes (', parseInt(s / 1024), ' KiB)'].join('');
    };

    // Generate TXt

    /* [20210609, JS]
     * format sha256 file in sha256sum syntax and add Modulnummer
     * 
     * original
     * var txtBlob = new Blob(['Nachname\t', postname_dspl.value, '\nVorname\t\t', prename_dspl.value, '\n\nDateiname\t', fnameSHA, '\nGröße\t\t', s, '\nSHA256\t\t', hash], { type: "text/plain;charset=utf-8" });	 
     */
    var txtBlob = new Blob(['; Modul\t\t', modulnummer_inp.value, '\n; Nachname\t', postname_dspl.value, '\n; Vorname\t', prename_dspl.value, '\n; Größe\t\t', s, '\n', hash, ' *', fname, ], { type: "text/plain;charset=utf-8" });

    // Geschmackssache: Nach Reinkopieren näher am Original
    //var txtBlob = new Blob(['Nachname\t', postname_dspl, '\nVorname\t','Name: ', kennziffer_inp.value,  '.zip\nGröße: ', s, '\nSHA256: ', hashOrg], {type: "text///plain;charset=utf-8"});

    // Alternative zum Download-Link: Download startet automatisch
    //saveAs(txtBlob, fname + '.SHA256')

    // innerHTML: Prüfsumme || Format abhängig von Radio Button
    if (optHash_rad.checked) {
        // Verlinkung des ZIP-Archivs mit innerHTML-Element
        var anchor = `<a href="${window.URL.createObjectURL(txtBlob)}" download="${fnameSHA}">${fnameSHA}</a>`;
        anchor_sha.push(anchor);

        printInfo(f);
        printInfoWithSha(fnameSHA, hash, '', anchor_sha);

    } else if (optZipHash_rad.checked) {
        // Verlinkung des ZIP-Archivs mit innerHTML-Element
        var anchor_sha = `<a href="${window.URL.createObjectURL(txtBlob)}" download="${fnameSHA}">${fnameSHA}</a>`;

        printInfoWithSha(fnameSHA, hash, anchor_zip, anchor_sha);
    }
}

/* Hilfsfunktion, die Informationen über hochgeladene Dateien der ZIP 
ins Feld list_dspl.innerHTML überträgt.
 
Aufruf von printInfo().
Aufruf von removeAllChildNodes().
 
Aufruf als addEventListener auf absenden_btn.
*/
function displayFileAttr(fileList) {
    var len = fileList.length;

    // Lösche alle aus vorherigen Klicks angelegten Kind-Knoten von list_dspl
    parent = list_dspl
    removeAllChildNodes(parent)

    // printInfo für alle Optionen:
    for (let i = 0; i < len; i++) {
        var file = fileList[i];
        printInfo(file);
    }

    // Change innerHTML
    anzahl_dspl.innerHTML = "Anzahl der Elemente: " + len + '<br><br>';
    /* Toggle Radio Button: Start-Werte
        Nach Initial-Werten greift toggleRadB: document.body.addEventListener()
    */
    if ((optZip_rad.checked) && (fileList.length != 0)) {
        progress.style.display = "";
        progress.innerHTML = '0%';
        progress.style.width = "";
        change_dspl.innerHTML = "Folgende Dokumente sollen einem ZIP-Archiv hinzugefügt werden: ";
    } else if (optHash_rad.checked) {
        progress.style.display = "none";
        progress.innerHTML = '0%';
        change_dspl.innerHTML = "Für folgende Dokumente sollen Hash-Werte generiert werden: ";
    } else if (optZipHash_rad.checked) {
        progress.style.display = "";
        progress.innerHTML = '0%';
        progress.style.width = "";
        change_dspl.innerHTML = "Folgende Dokumente sollen einem ZIP-Archiv hinzugefügt werden: ";
    }
}

/* Hilfsfunktion, die ArrayBuffer in CryptoJS' interne Datenstruktur WordArray konvertiert.
Wird von generateHash() für die SHA256-Generierung aufgerufen.
WordArray: holds the bytes as an array of words (32 bit integers)
ArrayBuffer: array of unsigned 8 bit integers
Warum ist das wichtig? Weil ansonsten Bytes verloren gehen und damit ein falscher Hash-Wert generiert wird.
vgl. https://www.py4u.net/discuss/289810
*/
function arrayBufferToWordArray(ab) {
    var i8a = new Uint8Array(ab);
    var a = [];
    for (var i = 0; i < i8a.length; i += 4) {
        a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
    }
    return CryptoJS.lib.WordArray.create(a, i8a.length);
}

/* Hilfsfunktion, die alle erstellten Kind-Knoten eines definierten Ausgangspunktes löscht.
Ausruf aus:
    - main():                           für Element optZip_rad.checked
    - displayFileAttr()                 für Elemente optHash_rad.checked, optZipHash_rad.checked
    - toggleRadB                        für alle Optionen | Togglen, unabhängig von Button-Betätigung 'hochgeladeneDateien_inp'
    - counter_btn.addEventListener()    Von 'Klausur Timer starten!' kommend werden alle Kindelemente von list_dspl und name_dspl zurückgesetzt.
    - dZ.addEventListener("drop")       Lösche alle alten Kind-Knoten, wenn Element auf Drag and Drop Feld fallengelassen wird.
*/
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*---------------------------------------------------------------------------------*/
/* EventListener, der den Datei-Upload startet: dynamisch.

Aufruf von init(). || Klappt nicht
*/
// Problem bei Aufruf von init(): Klappt nicht, warum nicht? 
//  (init() wird zu früh gestartet und führt somit in displayFileAttr() zu falschen Resultaten.)
hochgeladeneDateien_inp.addEventListener("change", function() {
    displayFileAttr(hochgeladeneDateien_inp.files);
    toggleRadB;
    document.getElementById("testtest").style.display = "block";
});



/* EventListener, der Drag and Drop Feld definiert.
    - dragArea.addEventListener('dragstart'):   Definiert Grenzen des Drag Feldes.
    - dZ.addEventListener('dragover'):          Transparenz des Feldes bei dragover erhöhen.
    - dZ.addEventListener('dragleave'):         Transparenz des Feldes bei dragleave verringern.
    - dZ.addEventListener('drop'):              Bei Fallenlassen von Objekten starten der init()-Funktion. Vorher: Lösche alle alten Kind-Knoten mit File-Informationen.
 */
dragArea.addEventListener('dragstart', e => {
    e.dataTransfer.setData("text/plain", dragArea.id);
})

for (dZ of dropZone) {
    // Definiere Drag Over Zone: Change in Opacity + Size
    dZ.addEventListener("dragover", e => {
        // Prevent default behaviour
        e.preventDefault();
        // Halbe Transparenz, während File reingezogen werden
        dZ.classList.add("drop_file_zone--over");
    });

    dZ.addEventListener("dragleave", e => {
        // Remove halbe Transparenz sobald DropZone verlassen wird
        dZ.classList.remove("drop_file_zone--over");
    });

    dZ.addEventListener("drop", e => {
        e.preventDefault();

        // Clear Content
        parent = list_dspl;
        removeAllChildNodes(parent);
        parent = name_dspl;
        removeAllChildNodes(parent);
        // Progress Bar zurücksetzen
        progress.style.display = "none";
        // progress.innerHTML = '';

        // File API
        // Bei File-Upload durch Drag und Drop: Prüfung Files/Folders?
        // Folder-Restriktion: Werfen Exception, deshalb hier Beschränkung auf File-Upload bei DragNDrop-Option.
        let files = e.dataTransfer ? e.dataTransfer.files : 'null';

        for (let i = 0, file; file = files[i]; i++) {
            var reader = new FileReader();

            reader.onload = function(e) { // Es wurden Files hochgeladen...
                // console.log('Upload: File (alles okay)');
            };
            reader.onerror = function(e) {
                alert('Bei Drag und Drop bitte keinen ganzen Ordner auswählen, sodern nur Dateien (ZIP-Archive sind aber auch okay).'); // Es wurde(n) (ein) Verzeichnis(se) hochgeladen...
                // Clear Content
                parent = list_dspl
                removeAllChildNodes(parent)
                parent = name_dspl
                removeAllChildNodes(parent)
                hochgeladeneDateien_inp.value = ''

                progress.style.display = "none";
                change_dspl.innerHTML = "";
                anzahl_dspl.innerHTML = "";

            };

            reader.readAsText(file);
        }

        hochgeladeneDateien_inp.files = e.dataTransfer.files

        // Remove halbe Transparenz in case of 'drop'
        dZ.classList.remove("drop_file_zone--over");

        init(hochgeladeneDateien_inp.files);
    });
}


/* EventLister, der auf Veränderungen der Radio Buttons reagiert:
    - Reset aller optionsspezifischen Felder, nachdem absenden_btn bedient wurde
    - Ausgangszustand für alle Optionen wiederherstellen: Es wurde noch nicht gezippt/gehasht/gezipt-hasht

Aufruf von printInfo().
Aufruf von removeAllChildNodes().
 
Aufruf als addEventListener auf hochgeladeneDateien_inp.
*/
var toggleRadB = document.body.addEventListener('change',
    function(e) {
        let target = e.target;
        const fileList = hochgeladeneDateien_inp.files;

        // Clear Content
        parent = list_dspl
        removeAllChildNodes(parent)
        parent = name_dspl
        removeAllChildNodes(parent)

        for (let f of fileList) {
            printInfo(f)
        }

        txt_dspl.innerHTML = ""
        name_dspl.innerHTML = ""
        progress.style.width = "";
        anzahl_dspl.innerHTML = "Anzahl der Elemente: " + fileList.length + '<br><br>';
        switch (target.id) {
            case 'zip':
                if (fileList.length != 0) {
                    progress.style.display = "";
                    progress.innerHTML = '0%';
                    change_dspl.innerHTML = "Folgende Dokumente sollen einem ZIP-Archiv hinzugefügt werden: ";
                } else {
                    progress.style.display = "";
                    progress.style.display = "none";
                    change_dspl.innerHTML = "";
                    anzahl_dspl.innerHTML = "";
                }
                break;
            case 'hashen':
                if (fileList.length != 0) {
                    progress.style.display = "none";
                    change_dspl.innerHTML = "Für folgende Dokumente sollen Hash-Werte generiert werden: ";
                } else {
                    progress.style.display = "";
                    progress.style.display = "none";
                    change_dspl.innerHTML = "";
                    anzahl_dspl.innerHTML = "";
                }
                break;
            case 'ziphash':
                if (fileList.length != 0) {
                    progress.style.display = "";
                    progress.innerHTML = '0%';
                    change_dspl.innerHTML = "Folgende Dokumente sollen einem ZIP-Archiv hinzugefügt werden: ";
                } else {
                    progress.style.display = "";
                    progress.style.display = "none";
                    change_dspl.innerHTML = "";
                    anzahl_dspl.innerHTML = "";
                }
                break;
        }
    });

/* EventListener on absenden_btn:
Muss auf Exceptions achten + den Radio Buttons gerecht werden.

Aufruf von main().
*/
absenden_btn.addEventListener('click', evt => {
    if (hochgeladeneDateien_inp.value.length == 0) { // Wenn kein(e) Dokument(e) hochgeladen wurde...
        alert('Es wurde(n) kein(e) Dokument(e) ausgewählt.');
    } else if ((document.querySelector('input[type="radio"]:checked') == null)) { // Wenn kein RadioButton angewählt wurde...
        alert('Bitte eine der drei Optionen auswählen.');
    } else {
        main();
    }
})

/* EventListener on counter_btn:
Von 'Klausur Timer starten!' kommend werden alle Kindelemente von list_dspl und name_dspl zurückgesetzt.

Aufruf von removeAllChildNodes().
 */
counter_btn.addEventListener('click', function() {
    // Clear Content
    parent = list_dspl
    removeAllChildNodes(parent)
    parent = name_dspl
    removeAllChildNodes(parent)
    change_dspl.innerHTML = "";
    anzahl_dspl.innerHTML = "";
    // Progress Bar zurücksetzen
    progress.style.display = "none";
    progress.innerHTML = '0%';
});


/* Weitere Prüfungen
Werden alle verwendeten File APIs vom Browser unterstützt?
*/
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    //alert('Alle File APIs werden vom Browser vollständig unterstützt.');
} else {
    alert('Die File APIs werden nicht vollständig vom Browser unterstützt.');
}