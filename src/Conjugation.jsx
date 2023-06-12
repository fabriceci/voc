import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  createRef,
} from "react";
import {
  parseSheet,
  cleanString,
  speak,
  getStatus,
  cleanAndNormalize,
  getPronom,
  getTense,
  getVerb,
  getRandomItem,
  updateStatus,
  getRatio,
} from "./utils";
import Bottom from "./Bottom";
import Helper from "./Helper";
import { useStore } from "./store";
import { Stats } from "./Stats";

export default function Conjugation() {
  const [verb, setVerb] = useState("");
  const [tense, setTense] = useState("");
  const [pronom, setPronom] = useState("");
  const [selectedTense, setSelectedTense] = useState("all");
  const [stats, setStats] = useState({success: 0, error: 0})

  const input = useStore((state) => state.input);
  const inputRef = useStore((state) => state.inputRef);
  const wordToFound = useStore((state) => state.wordToFound);
  const repeat = useStore((state) => state.repeat);
  const setWordToFound = useStore((state) => state.setWordToFound);
  const hasError = useStore((state) => state.hasError);
  const setRepeatCount = useStore((state) => state.setRepeatCount);
  const setHasError = useStore((state) => state.setHasError);
  const setInput = useStore((state) => state.setInput);
  const reset = useStore((state) => state.reset);
  const setCurrentKey = useStore((state) => state.setCurrentKey);
  const currentKey = useStore((state) => state.currentKey);

  useEffect(() => {
    nextItem();
  }, [selectedTense]);

  const hasRead = () => {
    setStats({success: stats.success, error: stats.error + 1})
  }

  const check = () => {
    const value = input.toLowerCase().trim();
    const target = [...wordToFound];
    if (value.trim() === "") return;

    if (target.map(cleanString).includes(cleanString(value))) {
      if (repeat && (error || show) && repeatCount < 2) {
        setInput("");
        setRepeatCount((c) => c + 1);
      } else {
        if (!hasError) {
          updateStatus(currentKey, 1);
          setStats({success: stats.success + 1, error: stats.error})
        }
        nextItem();
      }
      if (inputRef) inputRef.focus();
    } else {
      if (!hasError) {
        setHasError(true);
        updateStatus(currentKey, -1);
        setStats({success: stats.success, error: stats.error + 1})
      }
    }
  };
  const nextItem = () => {
    reset();
    let _pronom = getRandomItem(getPronom());
    let _tense = getRandomItem(getTense());
    if (selectedTense !== "all") {
      _tense = getTense().find((t) => t[0] === selectedTense);
    }
    const _verb = getRandomItem(getVerb());

    if (_tense[0] === "imp" || _tense === "impn") {
      if (_pronom[1] === 1) {
        _pronom = getPronom()[2];
      }
    }

    setVerb(_verb);
    setTense(_tense);
    setPronom(_pronom);
    var conj = new jsESverb();
    var result = conj.conjugate(_verb);
    const key = "" + _pronom[1] + _tense[0];
    setWordToFound([result[key]]);
    setCurrentKey(`${_verb}-${_tense[0]}-${_pronom[0]}`);
  };

  return (
    <>
      <div className="status" style={{ marginBottom: "20px" }}>
        <select
          value={selectedTense}
          onChange={(e) => setSelectedTense(e.target.value)}
          className="custom-select"
        >
          <option key="all" value="all">
            Tous les temps
          </option>
          {getTense().map((e) => (
            <option key={e[0]} value={e[0]}>
              {e[1]}
            </option>
          ))}
        </select>
      </div>
      <div className="currentWord alert alert-info">
        <strong>{verb}</strong> à la <strong>{[pronom[0]]}</strong> du{" "}
        <strong>{tense[1]}</strong>
      </div>
      <Helper />
      <Bottom next={nextItem} check={check} hasRead={hasRead} />
      <Stats>
        <div key="stats">
            {stats.success} réussi(s) / {stats.error} échec(s)
        </div>
      </Stats>
    </>
  );
}
