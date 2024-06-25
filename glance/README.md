# glance Graphics Library

## glance Code

Die glance library liegt sowohl als Typescript im `ts` Ordner, als auch als Javascript im `js`.
Das Javascript wird letztendlich ausgeführt, aber ich würde Ihnen empfehlen, sich den Typescript Code anzuschauen.
Der ist zwar länger, aber durch die zusätzliche Typisierung auch besser zu verstehen.

## index.html

Diese Datei enthält ein lauffähiges Beispielprojekt mit glance.

Um sie im Browser zu öffnen, muss das Verzeichnis über einen Webserver angesprochen werden. Andernfalls verweigert der Browser die Ausführung der Skripte aufgrund einer CORS-Verletzung.

Ich benutze dafür immer Python. Von der Kommandozeile aus kann man mit dem Befehl `python3 -m http.server` einen kleinen statischen HTTP-Server erstellen, der das aktuelle Verzeichnis hostet.
In node.js kann das Paket `http-server` für die gleiche Funktionalität verwendet werden.

Alternativ können Sie die CORS-Sicherheitsfunktion Ihres Browsers deaktivieren ... auf eigenes Risiko.
Setzen Sie dazu in Firefox die Option `security.fileuri.strict_origin_policy` in `about:config` auf `false`.
Chrome muss von der Kommandozeile aus mit dem zusätzlichen Argument `--disable-web-security` gestartet werden, wobei die Vorgehensweise je nach Betriebssystem variiert: https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome

