import {useEffect, useState, useCallback} from 'react';
import {GoogleSpreadsheet} from 'google-spreadsheet';

let modules = []
let words = []

const getRatio = (attempt, success) => {
    if (success === 0) return 0;
    return Math.round((success / attempt) * 100 * 100) / 100
}

async function loadGoogleSheet(force = false) {

    let result = JSON.parse(localStorage.getItem("words"));
    if (!result || force) {

        const doc = new GoogleSpreadsheet('1lA849BH1mhhAlnmhamfNnkXQVGJmEz_XpD5Fqbco5m0')
        doc.useApiKey('AIzaSyB3fhuMVnaW77F8ZiDu_mo_xJKdKzQo6tU')
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
        const rows = await sheet.getRows();
        const data = rows.map(r => {
            const data = {
                fr: r['fr'] ? r['fr'].trim() : undefined,
                es: r['es'] ? [r['es'].trim()] : [],
                type: r['type'] ? r['type'].trim() : undefined,
                module: r['module'] ? r['module'].trim() : undefined,
            }
            return data;
        })

        result = []
        var modulesList = []
        data.forEach(value => {
            // Restructuration
            if(value.fr){
                var index = result.findIndex(e => e.fr === value.fr);
                if (index === -1) {
                    result.push(value);
                } else {
                    result[index].es.push(...value.es);
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

    }

    words = [...result];
    modules = [...JSON.parse(localStorage.getItem("modules"))]
}

const getStatus = () => {
    const status = JSON.parse(localStorage.getItem("status"));
    if (!status) {
        return new Map();
    } else {
        return new Map(status);
    }
}

const updateStatus = (key, point) => {
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

function App() {
    const [vocabulary, setVocabulary] = useState([]);
    const [current, setCurrent] = useState(0)
    const [input, setInput] = useState('')
    const [error, setError] = useState(false)
    const [show, setShow] = useState(false)
    const [module, setModule] = useState('all')
    const [type, setType] = useState('error')
    const [tilde, setTilde] = useState(false)

    const refreshData = async () => {
        setVocabulary([]);
        localStorage.removeItem("words")
        localStorage.removeItem("modules")
        await loadGoogleSheet(true);
        setVocabulary([...words].sort(() => Math.random() - 0.5));
    }

    const readWord = (message) => {
        setError(true)
        var synth = window.speechSynthesis;
        if (!synth) {
            console.error("No speech syntesis API");
            return;
        }

        if (typeof message !== 'string') {
            message = vocabulary[current].es.join(", o ,");
        }

        var msg = new SpeechSynthesisUtterance(message);
        msg.pitch = 1.1;
        msg.rate = 1;
        msg.lang = 'es-ES'
        var voices = speechSynthesis.getVoices();
        var voice = voices.find(e => e.lang === 'es-ES')
        msg.voice = voice;

        synth.speak(msg);
    }

    const checkWord = useCallback(() => {
        const value = input.toLowerCase().trim();
        const target = vocabulary[current].es;
        if (value.trim() === '') return;
        if (target.map(t => t.toLowerCase()).includes(value)) {
            setCurrent(e => (e + 1) === vocabulary.length ? 0 : e + 1)
            setInput('')
            setError(false);
            setShow(false);
            setTilde(false);
            updateStatus(vocabulary[current].fr, error || show ? -1 : 1)
        } else {
            setError(true);
        }
    }, [current, vocabulary, input]);

    useEffect(() => {
        const loadSheet = async () => {
            await loadGoogleSheet();
            // setVocabulary([...words].sort(() => Math.random() - 0.5));
            filterModule('all', 'error')
        }

        loadSheet();

    }, [])

    useEffect(() => {
        const handleEnter = function (e) {
            if (e.key === '@') {
                setShow(e => true)
            }
            if (e.key === 'Control') {
                readWord()
            }
            if (e.key === 'Enter') {
                checkWord();
            }
        }

        document.addEventListener('keydown', handleEnter);
        return () => {
            document.removeEventListener('keydown', handleEnter);
        };
    }, [checkWord])

    useEffect(() => {
        if (tilde === true) {
            readWord("¿Dónde está la tilde?")
        }
    }, [tilde])

    const nextWord = () => {
        setCurrent(e => (e + 1) === vocabulary.length ? 0 : e + 1)
        setInput('')
        setShow(false);
        setError(false);
        setTilde(false);
        updateStatus(vocabulary[current].fr, -1)
    }


    const filterModule = (module, filter) => {
        var result = []
        if (module === 'all') {
            result = [...words];
        } else {
            result = words.filter(e => e.module === module);
        }
        const status = getStatus()
        if (filter === 'error') {
            result = result.filter(e => !status.has(e.fr) || getRatio(status.get(e.fr).attemps, status.get(e.fr).success) < 80);
        } else if (filter === 'error-only') {
            result = result.filter(e => status.has(e.fr) && getRatio(status.get(e.fr).attemps, status.get(e.fr).success) < 80);
        }

        setVocabulary(result.sort(() => Math.random() - 0.5));
    }

    const addFilter = (_type, value) => {
        if (_type === 'module') {
            filterModule(value, type);
            setModule(value)
        } else {
            filterModule(module, value)
            setType(value)
        }
    }

    if (vocabulary.length === 0) {
        return <div className="loader">
            <div>chargement...</div>
            <div className="lds-ripple">
                <div></div>
                <div></div>
            </div>
        </div>
    }

    var inputClass = 'mainInput';
    var currentWords = vocabulary[current].es.map(t => t.toLowerCase());
    var currentInput = input.toLowerCase().trim()
    if (error) inputClass += ' error';
    if (error && currentWords.includes(currentInput)) {
        inputClass += ' success'
    } else if (error && currentWords.map(e => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "")).includes(currentInput)) {
        inputClass += ' warning'
        if (!tilde) {
            setTilde(true)
        }

    }

    const handleTextarea = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            checkWord();
        }
    }
    const resultForWord = getStatus().get(vocabulary[current].fr);
    return (
        <div className="App">
            <div className="status">
                <div>{current + 1}/{vocabulary.length + 1}</div>
                <div>
                    <div className="btn btn-info btn-refresh" onClick={refreshData}>mettre à jour les données</div>
                </div>
                <div>
                    <div>
                        <select value={module} onChange={(e) => addFilter('module', e.target.value)}>
                            <option key="all" value="all">Tous les modules</option>
                            {
                                modules.map(e => <option key={e}>{e}</option>)
                            }
                        </select>
                    </div>
                    <div>
                        <select value={type} onChange={(e) => addFilter('type', e.target.value)}>
                            <option key="all" value="all">pas de filtre</option>
                            <option key="error" value="error">nouveaux et erreurs</option>
                            <option key="error-only" value="error-only">juste les erreurs</option>
                        </select>
                    </div>
                </div>
            </div>
            <div style={{position: 'relative'}}>
                <div className="help-message">Aide à la saisie, cliquez sur une lettre pour l'ajouter</div>
                <div className="helper">
                    <li><kbd onClick={() => setInput(input => input += 'ñ')}>ñ</kbd></li>
                    <li><kbd onClick={() => setInput(input => input += 'á')}>á</kbd></li>
                    <li><kbd onClick={() => setInput(input => input += 'ó')}>ó</kbd></li>
                    <li><kbd onClick={() => setInput(input => input += 'í')}>í</kbd></li>
                    <li><kbd onClick={() => setInput(input => input += '¡')}>¡</kbd></li>
                    <li><kbd onClick={() => setInput(input => input += '¿')}>¿</kbd></li>
                </div>
            </div>

            <div className="statistics">
                <div>{ vocabulary[current].es.length > 1 && vocabulary[current].es.length + " possibilités" }</div>
                <div>
                {resultForWord ? getRatio(resultForWord.attemps, resultForWord.success) + ' % de réussite' : 'nouveau'} | {vocabulary[current].module}
                </div>
            </div>
            <div className="currentWord alert alert-info">{vocabulary[current].fr}</div>


            <div className="input-group mb-3" style={{width: '100%'}}>
                <textarea className={inputClass} type="text" value={input}
                       onKeyPress={handleTextarea} onChange={(e) => setInput(e.target.value)}>{input}</textarea>
                <div className="input-group-append">
                    <button onClick={checkWord} className="btn btn-primary">Valider</button>
                </div>
            </div>
            {show &&
            <p className="answer">{vocabulary[current].es.join(', ')}</p>
            }

            <div className="solutions">
                {!show &&
                <button key="show" className="btn btn-danger" onClick={() => setShow(true)}>🕶 Voir la réponse</button>
                }
                {show &&
                <button key="next" className="btn btn-danger" onClick={nextWord}>Next</button>
                }
                <button key="read" className="btn btn-warning" onClick={readWord}>Écouter la
                    réponse 🔊
                </button>
            </div>
        </div>
    );
}

export default App;
