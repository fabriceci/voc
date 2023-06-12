import { useStore } from "./store";

export default function Helper() {

    let input = useStore((state) => state.input);
    const setInput = useStore((state) => state.setInput);

    const addLetter = (letter) => {
        setInput(input += letter);
    }

    return(
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
          <li>
            <kbd onClick={() => addLetter("é")}>ú</kbd>
          </li>
        </div>
      </div>
    )
}