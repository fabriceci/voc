import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  parseSheet,
  cleanString,
  speak,
  getStatus,
  cleanAndNormalize,
} from "./utils";
import Vocabulary from "./Vocabulary";
import Conjugation from "./Conjugation";
import Bottom  from './Bottom';

function App() {


  const [wordToFound, setWordToFound] = useState([]);
  const [wordToFoundExtra, setWordToFoundExtra] = useState([]);
  const [wordToFoundId, setWordToFoundId] = useState("");

  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const textInput = useRef(null);
  const [selectedType, setSelectedType] = useState("error");
  const [tilde, setTilde] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("conj");

  // Options
  const [repeat, setRepeat] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);

  /* new function */
  const setupWord = (word, extraAllowed, id) => {
    setInput("");
    setShow(false);
    setRepeatCount(0);
    setError(false);
    setTilde(false);
    setWordToFound(word);
    setWordToFoundId(id);
    if (textInput && textInput.current) textInput.current.focus();
  }

  const addError = () => {
    setError(true);
    updateStatus(setWordToFoundId, -1);
  }

  const addSuccess = () => {
    setError(false);
    setShow(false);
    updateStatus(setWordToFoundId, 1);
  }

  const addLetter = (letter) => {
    setInput((input) => (input += letter));
    if (textInput && textInput.current) textInput.current.focus();
  };

  const checkWord = () => {
    const value = input.toLowerCase().trim();
    const target = [...wordToFound, ...wordToFoundExtra];
    if (value.trim() === "") return;
    if (target.map(cleanString).includes(cleanString(value))) {
      if (repeat && (error || show) && repeatCount < 2) {
        setInput("");
        setRepeatCount((c) => c + 1);
      } else {
        if (current + 1 === vocabulary.length) {
          setCurrent(0);
          // reloadWords();
        } else {
          setCurrent((e) => e + 1);
        }
        setInput("");
        setRepeatCount(0);
        setError(false);
        setShow(false);
        setTilde(false);
        updateStatus(vocabulary[current].fr, error || show ? -1 : 1);
      }
      if (textInput && textInput.current) textInput.current.focus();
    } else {
      setError(true);
    }
  };

  const readWord = (message) => {
    if (textInput && textInput.current) textInput.current.focus();
    setError(true);

    if (typeof message !== "string") {
      message = vocabulary[current].es.join(", o ,");
    }

    speak(message);
  };

/*
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
      status.set(key, {
        attemps: 1,
        success: point === 1 ? 1 : 0,
        error: point === -1 ? 1 : 0,
      });
    }
    localStorage.setItem("status", JSON.stringify([...status]));
  };
*/
  var inputClass = "mainInput";
  var currentInput = cleanString(input);
  if (error) inputClass += " error";
  if (error && (wordToFound.includes(currentInput) || wordToFoundExtra.includes(currentInput))) {
    inputClass += " success";
  } else if (
    error &&
    currentWords
      .map(cleanAndNormalize)
      .includes(cleanAndNormalize(currentInput))
  ) {
    inputClass += " warning";
    if (!tilde) {
      setTilde(true);
    }
  }

  const resultForWord = wordToFound
    ? getStatus().get(wordToFound)
    : {};

  return (
    <div className="App">
      {/*
      <div
        className="navbar"
        style={{ background: "#ffffff61", margin: "10px 0 25px 0" }}
      >
        <div className="btn btn-warning" onClick={() => setMode("voc")}>
          Mode Vocabulaire
        </div>
        <div className="btn btn-warning" onClick={() => setMode("conj")}>
          Mode Conjugaison
        </div>
      </div>
    */}
      {mode === "voc" && <Vocabulary setWordToFound={setWordToFound} setWordToFoundId={setWordToFoundId} />}
      {mode === "conj" && <Conjugation />}



    </div>
  );
}

export default App;
