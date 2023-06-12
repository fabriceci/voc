import { useEffect, useState, useCallback, useRef, useMemo, createRef } from "react";
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
  getRatio
} from "./utils";

import { useStore } from "./store";

export function Stats({ children, moduleName = "", current = ""} ) {

    const wordToFound = useStore((state) => state.wordToFound);
    const hasError =  useStore((state) => state.hasError);
    const show = useStore((state) => state.show);
    const currentKey =  useStore((state) => state.currentKey);
    const repeatCount =  useStore((state) => state.repeatCount);
    const repeat =  useStore((state) => state.repeat);


    if(!wordToFound) return null;

    const resultForWord = getStatus().get(currentKey)

    return(
        <>
        <div className="statistics" style={{ marginTop: "20px"}}>
          <div>
            {wordToFound.length + " possibilité(s)"}
          </div>

          {repeat && (show || hasError) && <div>{repeatCount}/3</div>}
          <div>
            {resultForWord
              ? getRatio(resultForWord.attemps, resultForWord.success) +
                " % de réussite"
              : "nouveau"}{" "}
           {/*moduleName !== "" &&  `| ${moduleName}` */}
          </div>
        </div>
        <div style={{fontSize: "20px", textAlign: "center", MarginTop: "20px"}}>
        {children}
        </div>
         {/* 
        <div className="currentWord alert alert-info">
       current !== "" &&  `| ${current}` 
        </div>
        */}
      </>
    )
}