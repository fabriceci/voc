import {useEffect, useState, useCallback, useRef, useMemo} from 'react';
import useGoogleSheets from 'use-google-sheets';

const getRatio = (attempt, success) => {
    if (success === 0) return 0;
    return Math.round((success / attempt) * 100 * 100) / 100
}

const cleanString = (s) => {
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

const cleanAndNormalize = (s) => cleanString(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "")

function parseSheet(rows) {

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
  

    const { data, loading, errorData, refetch } = useGoogleSheets({
        apiKey: "AIzaSyB3fhuMVnaW77F8ZiDu_mo_xJKdKzQo6tU",
        sheetId: "1lA849BH1mhhAlnmhamfNnkXQVGJmEz_XpD5Fqbco5m0",
    });
    const [vocabulary, setVocabulary] = useState([]);
    const [module, setModule] = useState('all')

    const [error, setError] = useState(false)
    const [current, setCurrent] = useState(0)
    const [repeat, setRepeat] = useState(true)
    const [minimal, setMinimal] = useState(true)
    const [repeatCount, setRepeatCount] = useState(0)
    const [input, setInput] = useState('')
    const [show, setShow] = useState(false)
   
    const [type, setType] = useState('error')
    const [tilde, setTilde] = useState(false)
    const textInput = useRef(null);

    const refreshData = async () => {
        setVocabulary([]);
        localStorage.removeItem("words")
        localStorage.removeItem("modules")
        //await loadGoogleSheet(true);
        // setVocabulary([...words].sort(() => Math.random() - 0.5));
        if (textInput && textInput.current) textInput.current.focus()
        setModule('all');
        setType('error');
        // reloadWords();
    }

    useEffect(() => {

      if(!loading) {
          const result = parseSheet(data)
          setVocabulary(result[0])
          setModule(result[1])
      }

    }, [data])

    const readWord = (message) => {
        if (textInput && textInput.current) textInput.current.focus();
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
        if (target.map(cleanString).includes(cleanString(value))) {
            if (repeat && (error || show) && repeatCount < 4) {
                setInput('')
                setRepeatCount(c => c + 1)
            } else {
                if (current + 1 === vocabulary.length) {
                    setCurrent(0)
                   // reloadWords();
                } else {
                    setCurrent(e => e + 1);
                }
                setInput('')
                setRepeatCount(0)
                setError(false);
                setShow(false);
                setTilde(false);
                updateStatus(vocabulary[current].fr, error || show ? -1 : 1)
            }
            if (textInput && textInput.current) textInput.current.focus();
        } else {
            setError(true);
        }
    }, [current, vocabulary, input]);

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

    const reloadWords = () => {
        let result = [...words]
        if (minimal) {
            result = result.filter(e => e.minimum)
        }
        if (module !== 'all') {
            result = result.filter(e => e.module === module);
        }

        const status = getStatus()
        var copy = [...result]
        if (type === 'error') {
            result = result.filter(e => !status.has(e.fr) || getRatio(status.get(e.fr).attemps, status.get(e.fr).success) < 80);
        } else if (type === 'error-only') {
            result = result.filter(e => status.has(e.fr) && getRatio(status.get(e.fr).attemps, status.get(e.fr).success) < 80);
        }

        // To do: changer ça
        if (result.length === 0) {
            setType('all');
            result = copy;
        }
        setCurrent(0)
        setInput('');
        setShow(false);
        setRepeatCount(0);
        setError(false);
        setTilde(false);
        setVocabulary(result.sort(() => Math.random() - 0.5));
        if (textInput && textInput.current) textInput.current.focus()
    }
    /*
    useEffect(() => {
        reloadWords()
    }, [module, type, minimal])
*/

    const nextWord = () => {
        if (current + 1 === vocabulary.length) {
            setCurrent(0)
        } else {
            setCurrent(e => e + 1);
        }
        setInput('');
        setShow(false);
        setRepeatCount(0);
        setError(false);
        setTilde(false);
        updateStatus(vocabulary[current].fr, -1)
        if (textInput && textInput.current) textInput.current.focus()
    }

    const addLetter = (letter) => {
        setInput(input => input += letter)
        if (textInput && textInput.current) textInput.current.focus()
    }



    var inputClass = 'mainInput';
    var currentWords = vocabulary[current] ? vocabulary[current].es.map(cleanString) : {};
    var currentInput = cleanString(input);
    if (error) inputClass += ' error';
    if (error && currentWords.includes(currentInput)) {
        inputClass += ' success'
    } else if (error && currentWords.map(cleanAndNormalize).includes(cleanAndNormalize(currentInput))) {
        inputClass += ' warning'
        if (!tilde) {
            setTilde(true)
        }

    }

    if (loading) {
      return <div className="loader">
          <div>chargement...</div>
          <div className="lds-ripple">
              <div></div>
              <div></div>
          </div>
      </div>
    }

    console.log(module)

    const handleTextarea = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkWord();
        }
    }
    const resultForWord = vocabulary[current] ? getStatus().get(vocabulary[current].fr) : {};
    return (
        <div className="App">
            <div className="status">
                <div>{current + 1}/{vocabulary.length}</div>
                <div>
                    <div className="btn btn-info btn-refresh" onClick={refreshData}>mettre à jour les données</div>
                </div>
                <div>
                    <div>
                        <select value={module} onChange={(e) => setModule(e.target.value)}>
                            <option key="all" value="all">Tous les modules</option>
                            {
                                module.map(e => <option key={e}>{e}</option>)
                            }
                        </select>
                    </div>
                    <div>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option key="all" value="all">pas de filtre</option>
                            <option key="error" value="error">nouveaux et erreurs</option>
                            <option key="error-only" value="error-only">juste les erreurs</option>
                        </select>
                    </div>
                    <div>
                        <input onChange={() => {
                            if (textInput && textInput.current) textInput.current.focus();
                            setRepeat(e => !e)
                        }} checked={repeat} type="checkbox" className="form-check-input" id="repeatMode"/>
                        <label className="form-check-label" htmlFor="repeatMode">Répeter en cas d'erreur</label>
                    </div>
                    <div>
                        <input onChange={() => {
                            if (textInput && textInput.current) textInput.current.focus();
                            setMinimal(e => !e)
                        }} checked={minimal} type="checkbox" className="form-check-input" id="minVoc"/>
                        <label className="form-check-label" htmlFor="minVoc">Juste le vocabulaire essentiel</label>
                    </div>
                </div>
            </div>
            <div style={{position: 'relative'}}>
                <div className="help-message">Aide à la saisie, cliquez sur une lettre pour l'ajouter</div>
                <div className="helper">
                    <li><kbd onClick={() => addLetter('ñ')}>ñ</kbd></li>
                    <li><kbd onClick={() => addLetter('á')}>á</kbd></li>
                    <li><kbd onClick={() => addLetter('ó')}>ó</kbd></li>
                    <li><kbd onClick={() => addLetter('í')}>í</kbd></li>
                    <li><kbd onClick={() => addLetter('ú')}>ú</kbd></li>
                </div>
            </div>
            {vocabulary.length === 0 &&
            <div className="center">Pas de résultats</div>
            }
            {vocabulary.length > 0 &&
            <>
                <div className="statistics">
                    <div>{vocabulary[current].es.length > 1 && vocabulary[current].es.length + " possibilités"}</div>
                    {repeat && (show || error) && <div>
                        {repeatCount}/5
                    </div>
                    }
                    <div>
                        {resultForWord ? getRatio(resultForWord.attemps, resultForWord.success) + ' % de réussite' : 'nouveau'} | {vocabulary[current].module}
                    </div>
                </div>
                <div className="currentWord alert alert-info">{vocabulary[current].fr}</div>


                <div className="input-group mb-3" style={{width: '100%'}}>
                <textarea ref={textInput} className={inputClass} type="text" value={input}
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
                    <button key="show" className="btn btn-danger" onClick={() => {
                        if (textInput) textInput.current.focus()
                        setShow(true)
                    }
                    }>🕶 Voir la réponse</button>
                    }
                    {show &&
                    <button key="next" className="btn btn-danger" onClick={nextWord}>Next</button>
                    }
                    <button key="read" className="btn btn-warning" onClick={readWord}>Écouter la
                        réponse 🔊
                    </button>
                </div>
            </>
            }

        </div>
    );
}

export default App;
