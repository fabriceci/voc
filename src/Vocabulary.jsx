import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import useGoogleSheets from "use-google-sheets";
import {
  parseSheet,
  cleanString,
  speak,
  getStatus,
  cleanAndNormalize,
} from "./utils";

export default function Vocabulary({ setWordToFound, setWordToFoundId }) {
  const { data, loading, errorData, refetch } = useGoogleSheets({
    apiKey: "AIzaSyB3fhuMVnaW77F8ZiDu_mo_xJKdKzQo6tU",
    sheetId: "1lA849BH1mhhAlnmhamfNnkXQVGJmEz_XpD5Fqbco5m0",
  });
  const [allData, setAllData] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [modules, setModules] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selectedModule, setSelectedModule] = useState("all");
  const [minimal, setMinimal] = useState(true);

  useEffect(() => {
    if (!loading) {
      const result = parseSheet(data[0].data);
      setAllData(result[0]);
      setModules(result[1]);
    }
  }, [data]);

  useEffect(() => {
    if (!loading) {
      const result = parseSheet(data[0].data);
      setAllData(result[0]);
      setModules(result[1]);
    }
  }, [data]);

  // filter data
  useEffect(() => {
    let result = [...allData];
    if (minimal) {
      result = result.filter((e) => e.minimum);
    }
    if (selectedModule !== "all") {
      result = result.filter((e) => e.module === selectedModule);
    }

    const status = getStatus();
    var copy = [...result];
    if (selectedType === "error") {
      result = result.filter(
        (e) =>
          !status.has(e.fr) ||
          getRatio(status.get(e.fr).attemps, status.get(e.fr).success) < 80
      );
    } else if (selectedType === "error-only") {
      result = result.filter(
        (e) =>
          status.has(e.fr) &&
          getRatio(status.get(e.fr).attemps, status.get(e.fr).success) < 80
      );
    }

    // To do: changer ça
    if (result.length === 0) {
      setSelectedType("all");
      result = copy;
    }
    setCurrent(0);
    setInput("");
    setShow(false);
    setRepeatCount(0);
    setError(false);
    setTilde(false);
    setVocabulary(result.sort(() => Math.random() - 0.5));
    if (textInput && textInput.current) textInput.current.focus();
  }, [selectedModule, selectedType, minimal, allData]);

  const refreshData = () => {
    localStorage.removeItem("words");
    localStorage.removeItem("modules");
    refetch();
    if (textInput && textInput.current) textInput.current.focus();
    setModule("all");
    setSelectedType("error");
  };

  const nextWord = () => {
    if (current + 1 === vocabulary.length) {
      setCurrent(0);
    } else {
      setCurrent((e) => e + 1);
    }
  };

  if (loading || allData.length === 0) {
    return (
      <div className="loader">
        <div>chargement...</div>
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="status">
        <div>
          {current + 1}/{vocabulary.length}
        </div>
        <div>
          <div className="btn btn-info btn-refresh" onClick={refreshData}>
            mettre à jour le vocabulaire
          </div>
        </div>
        <div>
          <div>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="custom-select"
            >
              <option key="all" value="all">
                Tous les modules
              </option>
              {modules.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="custom-select"
            >
              <option key="all" value="all">
                pas de filtre
              </option>
              <option key="error" value="error">
                nouveaux et erreurs
              </option>
              <option key="error-only" value="error-only">
                juste les erreurs
              </option>
            </select>
          </div>
          <div>
            <input
              onChange={() => {
                if (textInput && textInput.current) textInput.current.focus();
                setRepeat((e) => !e);
              }}
              checked={repeat}
              type="checkbox"
              className="form-check-input"
              id="repeatMode"
            />
            <label className="form-check-label" htmlFor="repeatMode">
              Répeter en cas d'erreur
            </label>
          </div>
          <div>
            <input
              onChange={() => {
                if (textInput && textInput.current) textInput.current.focus();
                setMinimal((e) => !e);
              }}
              checked={minimal}
              type="checkbox"
              className="form-check-input"
              id="minVoc"
            />
            <label className="form-check-label" htmlFor="minVoc">
              Juste le vocabulaire essentiel
            </label>
          </div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div className="help-message">
          Aide à la saisie, cliquez sur une lettre pour l'ajouter
        </div>
        <div className="helper">
          <li>
            <kbd onClick={() => addLetter("ñ")}>ñ</kbd>
          </li>
          <li>
            <kbd onClick={() => addLetter("á")}>á</kbd>
          </li>
          <li>
            <kbd onClick={() => addLetter("ó")}>ó</kbd>
          </li>
          <li>
            <kbd onClick={() => addLetter("í")}>í</kbd>
          </li>
          <li>
            <kbd onClick={() => addLetter("ú")}>ú</kbd>
          </li>
        </div>
      </div>
      {vocabulary.length === 0 && (
        <div className="center">Pas de résultats</div>
      )}
      {vocabulary.length > 0 && (
        <>
          <div className="statistics">
            <div>
              {vocabulary[current].es.length > 1 &&
                vocabulary[current].es.length + " possibilités"}
            </div>

            {repeat && (show || error) && <div>{repeatCount}/3</div>}
            <div>
              {resultForWord
                ? getRatio(resultForWord.attemps, resultForWord.success) +
                  " % de réussite"
                : "nouveau"}{" "}
              | {vocabulary[current].module}
            </div>
          </div>
          <div className="currentWord alert alert-info">
            {vocabulary[current].fr}
          </div>
        </>
      )}
    </>
  );
}
