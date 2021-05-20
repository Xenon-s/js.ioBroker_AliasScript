

# Alias Script fuer ioBroker V0.1
Dieses Script ermöglicht es, alias States zu erzeugen. Die Unterschied zu schon vorhandenen Boardmitteln, bzw. Adaptern ist, dass man nahezu nichts von Hand eingeben muss. Es reicht der Name des Datenpunktes.
Das Script erstellt dann anhand des device-Namens eine neue Ordnerstruktur mit ausschließlich den Datenpunkten, die vom User vorgegeben werden. 

## Was sollte beachtet werden?
Aktuell funktioniert dieses Script nur mit dem ioBroker Zigbee Adapter. Erweiterungen werden folgen (können auch per Issue angefragt werden). Es sollten nur die wirklich relevanten Datenpunkte per Alias angelegt werden, um keine unnötige Systemlast zu erzeugen.

## Was ist geplant?
- Delete Button: Per Klick sollen alle nicht mehr vorhandenen Datenpunkte automatisch entfernt werden
- Integration weiterer Adapter

## Wie funktioniert es?
Es gibt im Script selber nur zwei Parameter, die der User ändern kann.
- den neuen Zielpfad
- die Zigbee Instanz (aktuell nur Zigbee möglich!)

# Anleitung
## Script erstellen
Ein neues JS Script in iobroker erstellen und das [Alias-Script V0.1 ](https://raw.githubusercontent.com/Xenon-s/js.ioBroker_AliasScript/main/alias_script_V_0_1.js) aus "alias_script_V_0_1.js" kopieren und einfügen. <br>

![erstellung_1.png](/pictures/erstellung_1.png) <br> 
![erstellung_2.png](/pictures/erstellung_2.png) <br>

## Einstellungen
### Script
Folgendes kann optional geändert werden:
- Zielpfad (Standard: "0_userdata.0.alias_zigbee")
- Adapterinstanz (Standard: "zigbee.0")

![User_Input.png](/pictures/User_Input.png) <br>

### Datenpunkte
Es wird der Datenpunkt 0_Config zur Verfügung gestellt. Im Datenpunkt "attributes" werden dann die gewüschten States eingetragen. Standardmäßig stehen hier bereits "state, temperature, occupancy" drin. Jeder weitere Eintrag muss mit einem Komma getrennt werden. 

![attributes.png](/pictures/attributes.png) <br>

### Sonstiges
Original Struktur aus dem Adapter:
![original.png](/pictures/original.png) <br>

Struktur durch das Skript:
![alias.png](/pictures/alias.png) <br>



**Falls euch meine Arbeit gefällt :** <br>

[![Paypal Donation](https://img.shields.io/badge/paypal-donate%20%7C%20spenden-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3EYML5A4EMJCW&source=url)


## Changelog

### 0.1 (20-05.2021)
* (xenon-s) initial commit


# License

The MIT License (MIT)

Copyright (c) 2021 xenon-s

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.