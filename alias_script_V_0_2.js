// script um Zigbee states zu spiegeln und unzubennen
const zigbee = 'zigbee.0';
const target = '0_userdata.0.alias_zigbee'

// Finger weg !

class aliasZigbee {
    constructor() {
        this.message = `zigbee alias script: Version 0.2, dev: xenon-s Have fun with it!`;
        this.dev = 'xenon-s'
        this.objName = []; // Namen aller Zigbee Devices
        this.arrayTrigger = []; // Array mit allen Trigger Pfaden
        this.ids = [];  // Array aller Zigbee Ids aus dem Adapter
        this.objNew = {};   // Objekt mit den neu zusammengebauten Objekten, die unter userdata angelegt werden
        this.config = {};
        this.attributes = [];
        log(this.message);
        loop('start');
    };
};

new aliasZigbee();

// get ids from zigbee
/**
* @param {string} cmd
*/
async function loop(cmd) {
    if (cmd === 'start') {
        createConfig();
    } else {
        this.ids = await Array.prototype.slice.apply($(`state[id='${zigbee}*']`));
        this.objName = await getIDs();
        this.objNew = await getName();
        this.arrayTrigger = await createDp();
        await createTrigger(cmd);
    };
};

async function createConfig() {
    this.config = {
        // refresh_Button: {
        //     parse: {
        //         "name": "Refresh Button",
        //         "type": "boolean",
        //         "read": false,
        //         "write": true,
        //         "role": "button"
        //     },
        // },
        attributes: {
            parse: {
                "name": "Zigbee State Types",
                "type": "string",
                "read": true,
                "write": true,
                "role": "state"
            },
            ini: ['state', 'temperature', 'occupancy']
        }
    };

    // Config Dps erstellen
    for (const i in this.config) {
        let path = '';
        path = `${target}.0_Config.${i}`;
        let com = '';
        com = JSON.stringify(this.config[i].parse);

        // Pruefen ob DPs vorhanden
        if (!getObject(path)) {
            createStateAsync(path, JSON.parse(com), async () => {
                if (i == 'attributes') {
                    setStateAsync(path, this.config[i].ini.toString(), true)
                };
            });
        }
        if (i == 'attributes') {
            const result = await getStateAsync(path);
            this.attributes = result !== null ? result.val.split(',') || [] : this.config.attributes.ini;
        };

        // // trigger auf config
        on({ id: path, change: "any", ack: false }, async obj => {
            if (obj.id === `${target}.0_Config.attributes`) {
                this.attributes = obj.state.val.split(',');
                const value = obj.state.val;
                setState(path, value, true);
            };
            loop(null);
        });

    };

    setTimeout(() => {
        loop(null);
    }, 500)

};

// eindeutige device namen aus der id holen
async function getIDs() {
    let arrTemp = [];
    this.ids.forEach(async data => {
        let str = ``;
        str = data;
        let name = ``
        let res = str.lastIndexOf('.')
        name = str.slice(0, res);
        // namen bereits im array enthalten?
        // wenn nicht, hinzufügen
        if (!arrTemp.includes(name)) {
            arrTemp.push(name)
        };
    });
    return arrTemp;
};

// neues Objekt bauen 
async function getName() {
    let objId = {};
    for (const i in this.objName) {
        const data = this.objName[i];
        const id = data;
        let objTempName = {};
        let objOriTemp = {};

        // namen aus dem device auslesen
        objTempName = await getObjectAsync(data); // objekt auslesen

        for (const name in this.attributes) {
            let strTemp = ``;
            // 
            if (objTempName.type == 'device') {
                strTemp = `${data}.${this.attributes[name]}`;

                // nach id suchen und prüfen ob 'angegebene attribute' enthalten sind
                if (this.ids.includes(strTemp)) {
                    objOriTemp = await getObjectAsync(strTemp); // objekt auslesen
                    if (objOriTemp.type == 'state') {

                        // objekt neu schreiben und vom User ausgewaehlte DPs speichern
                        const deviceName = `${objOriTemp.common.name} ${objTempName.common.name}`
                        const length = objOriTemp._id.lastIndexOf('.') + 1;
                        const lengthId = objOriTemp._id.length;
                        const nameID = objOriTemp._id.slice(length, lengthId)

                        log(JSON.stringify(objOriTemp.common))

                        objId[`${id}.${this.attributes[name]}`] = {
                            id: id,
                            // name: objTempName.common.name.replace(/ /g, '_'),
                            name: objTempName.common.name,
                            nameNew: deviceName,
                            nameDP: nameID,
                            idState: objOriTemp._id,
                            common: objOriTemp.common
                        };
                    };
                };
            };
        };
    };
    return objId;
};

// datenpunkte erstellen
async function createDp() {
    let arrTemp = [];
    for (const i in this.objNew) {
        let pathNew = ``;
        let com = ``;

        pathNew = `${target}.${this.objNew[i].name}.${this.objNew[i].nameDP}`;

        this.objNew[i].common.name = this.objNew[i].nameNew;

        com = JSON.stringify(this.objNew[i].common);

        // neue Datenpunkte erzeugen
        if (!getObject(pathNew)) {
            createStateAsync(pathNew, JSON.parse(com), async () => {
                const value = await getStateAsync(this.objNew[i].idState)
                if (value != null) {
                    await setStateAsync(pathNew, value.val, true)
                };
            });
        };

        const objTrigger = { triggerAdapter: this.objNew[i].idState, triggerCopy: pathNew }
        arrTemp.push(objTrigger);
    };
    return arrTemp;
};

// trigger erstellen
/**
* @param {string} cmd
*/
async function createTrigger(cmd) {
    for (const i in this.arrayTrigger) {

        let triggerAdapter = '';
        let triggerCopy = '';

        triggerAdapter = this.arrayTrigger[i].triggerAdapter;
        triggerCopy = this.arrayTrigger[i].triggerCopy;

        // "subscriptions" löschen
        if (cmd !== 'start') {
            if (unsubscribe(triggerAdapter)) {
            };

            if (unsubscribe(triggerCopy)) {
            };
        };

        // trigger auf adapter.state
        on({ id: triggerAdapter, change: "any", ack: true }, async obj => {
            const value = obj.state.val;
            setState(triggerCopy, value, true);
        });

        // trigger auf copy.state
        on({ id: triggerCopy, change: "any", ack: false }, async obj => {
            const value = obj.state.val;
            setState(triggerAdapter, value);
        });
    };
};

