import { useEffect, useState, useCallback, useRef, useMemo, createRef } from "react";
import {
  parseSheet,
  cleanString,
  speak,
  getStatus,
  cleanAndNormalize,
  updateStatus,
  getRatio
} from "./utils";

import { useStore } from "./store";

export default function Bottom({ check, next, hasRead }){
  // Getting the state updater function and current ref from the store
  const show = useStore((state) => state.show);
  const setShow = useStore((state) => state.setShow);
  const inputRef = useStore((state) => state.inputRef);
  const setInputRef = useStore((state) => state.setInputRef);
  const input = useStore((state) => state.input);
  const setInput = useStore((state) => state.setInput);
  const wordToFound = useStore((state) => state.wordToFound);
  const hasError = useStore((state) => state.hasError);
  const setHasError = useStore((state) => state.setHasError);
  const lackTilde = useStore((state) => state.lackTilde);
  const setLackTilde = useStore((state) => state.setLackTilde);

  const combinedRef = useCallback(node => {
    setInputRef(node);
  }, []);

  const handleTextarea = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      check();
    }
  };

  const readWord = (message) => {
    if(hasRead) {
      hasRead()
    }
    if(!hasError) {
      setHasError(true);
      updateStatus(getKey(), -1)
    }
    if (inputRef && inputRef.current) inputRef.focus()
    if (typeof message !== "string") {
      message = wordToFound.join(", o ,");
    }

    speak(message);
  };

  var inputClass = "mainInput";
  var currentInput = cleanString(input);
  if (hasError) inputClass += " error";
  if (hasError && wordToFound.includes(currentInput)) {
    inputClass += " success";
  } else if (
    hasError &&
    wordToFound
      .map(cleanAndNormalize)
      .includes(cleanAndNormalize(currentInput))
  ) {
    inputClass += " warning";
    if (!lackTilde) {
      setLackTilde(true);
    }
  }

  return (
    <>
      <div className="input-group mb-3" style={{ width: "100%" }}>
        <textarea
          ref={combinedRef}
          className={inputClass}
          type="text"
          value={input}
          onKeyPress={handleTextarea}
          spellCheck="false"
          onChange={(e) => setInput(e.target.value)}
          rows="1"
        >
          {input}
        </textarea>
        <div className="input-group-append">
          <button onClick={check} className="btn btn-primary">
            Valider
          </button>
        </div>
      </div>
      <div>{show && <p className="answer">{wordToFound.join(", ")}</p>}</div>
      <div className="solutions">
        {!show && (
          <button
            key="show"
            className="btn btn-danger"
            onClick={() => {
              if (inputRef) inputRef.focus();
              setShow(true);
            }}
          >
            🕶 Voir la réponse
          </button>
        )}
        {show && (
          <button key="next" className="btn btn-danger" onClick={next}>
            Next
          </button>
        )}
        <button key="read" className="btn btn-warning" onClick={readWord}>
          Écouter la réponse 🔊
        </button>
      </div>
    </>
  );
};
