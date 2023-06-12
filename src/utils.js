export function getRatio(attempt, success) {
    if (success === 0) return 0;
    return Math.round((success / attempt) * 100 * 100) / 100
}

export function cleanString(s){
    if (!s) return ''
    return s.replaceAll('¡', '')
        .replaceAll('!', '')
        .replaceAll('¿', '')
        .replaceAll('?', '')
        .replaceAll('.', '')
        .replaceAll('…', '')
        .replace(/\s\s+/g, ' ')
        .trim()
        .toLowerCase();
}

export function cleanAndNormalize(s){
    return cleanString(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function parseSheet(rows) {
    console.log("row", rows)
    const data = rows.map(r => {
        const data = {
            fr: r['fr'] ? r['fr'].trim() : undefined,
            es: r['es'] ? [r['es'].trim()] : [],
            type: r['type'] ? r['type'].trim() : undefined,
            module: r['module'] ? r['module'].trim() : undefined,
            subject: r['sujet'] ? r['sujet'].trim() : undefined,
            minimum: r['minimum'],
        }
        return data;
    })

    var result = []
    var modulesList = []
    data.forEach(value => {
        // Restructuration
        if (value.fr) {
            var index = result.findIndex(e => e.fr === value.fr);
            if (index === -1) {
                result.push(value);
            } else {
                if (!result[index].es.includes(...value.es)) {
                    result[index].es.push(...value.es);
                }
            }

            // liste des modules

            if (value.module && !modulesList.includes(value.module)) {
                modulesList.push(value.module);
            }
        }
    })
    // ajout dans la variable globale et dans le storage
    localStorage.setItem("words", JSON.stringify(result));
    localStorage.setItem("modules", JSON.stringify(modulesList));
    localStorage.setItem("lastsync", JSON.stringify(new Date().getTime()));
    

    const voc = [...result];
    const modules = [...JSON.parse(localStorage.getItem("modules"))]
    return [voc, modules]
}


export function getStatus(){
    const status = JSON.parse(localStorage.getItem("status"));
    if (!status) {
        return new Map();
    } else {
        return new Map(status);
    }
}

export function updateStatus(key, point){
    let status = getStatus();
    if (status.has(key)) {
        var keyValue = status.get(key);
        keyValue.attemps += 1;
        if (point === 1) {
            keyValue.success += 1;
        } else {
            keyValue.error += 1;
        }
        status.set(key, keyValue);
    } else {
        status.set(key, {attemps: 1, success: point === 1 ? 1 : 0, error: point === -1 ? 1 : 0})
    }
    localStorage.setItem("status", JSON.stringify([...status]));
}

export function speak(message) {
    var synth = window.speechSynthesis;
    if (!synth) {
        console.error("No speech syntesis API");
        return;
    }

    var msg = new SpeechSynthesisUtterance(message);
    msg.pitch = 1;
    msg.rate = 0.8;
    msg.lang = 'es-ES'
    /*
    var voices = speechSynthesis.getVoices();
    var voice = voices.find(e => e.lang === 'es-ES')
    msg.voice = voice;
*/
    synth.speak(msg);
}

export function getTense() {

    return [
        [ "pre", "Presente del indicativo"],
        [ "pres", "Presente del subjunctivo"],
        //[ "ppro", "Presente "],
    
        [ "fut", "El futuro"],
        [ "pos", "El condicional"],
    
        [ "pas", "Pretérito indefinido"],
        [ "pp", "El presente perfecto"],
        [ "cop", "El imperfecto"], 
    
        [ "imp", "Imperativo positivo"],
        [ "impn", "Imperativo negativo (no + )"],
    ]
}

export function getPronom() {

    return [
        [ "1 p.s.", 1],
        [ "2 p.s.", 2],
        [ "3 p.s.", 3],
        [ "1 p.p.", 4],
        [ "2 p.p.", 5],
        [ "3 p.p.", 6],
    ]
}

export function getVerb() {
    return [
        "comer",
        "vivir",
        "hablar",
        "pensar",
        "entender",
        "querer",
        "preferir",
        "sentir",
        "poder",
        "dormir",
        "jugar",
        "pedir",
        "repetir",
        "seguir",
        "vestirse",
        "caer",
        "hacer",
        "poner",
        "salir",
        "traer",
        "venir",
        "dar",
        "ver",
        "estar",
        "conocer",
        "saber",
        "coger",
        "construir",
        "ser",
        "ir",
        "haber",
        "tener",
        "leer",
        "conducir",
        "jugar",
        "decir",
    
    ]
}

export function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}